import type { SecurityEventType } from '../types/assessment';
import { recordSecurityViolation } from './assessmentStore';

export interface SecurityViolationNotice {
  eventType: SecurityEventType;
  level: 1 | 2 | 3;
  title: string;
  message: string;
  violationsCount: number;
  isTerminated: boolean;
}

export type ViolationCallback = (notice: SecurityViolationNotice) => void;

export class SecurityEngine {
  private candidateId: string;
  private onViolation: ViolationCallback;
  private isExamActive: boolean = false;
  private debounceMap: Map<string, number> = new Map();

  constructor(candidateId: string, onViolation: ViolationCallback) {
    this.candidateId = candidateId;
    this.onViolation = onViolation;
  }

  public activate(): void {
    if (this.isExamActive) return;
    this.isExamActive = true;

    // Attach all browser proctoring listeners
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('copy', this.handleCopy);
    document.addEventListener('cut', this.handleCut);
    document.addEventListener('paste', this.handlePaste);
    document.addEventListener('contextmenu', this.handleContextMenu);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('offline', this.handleOffline);
  }

  public deactivate(): void {
    this.isExamActive = false;
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('copy', this.handleCopy);
    document.removeEventListener('cut', this.handleCut);
    document.removeEventListener('paste', this.handlePaste);
    document.removeEventListener('contextmenu', this.handleContextMenu);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('offline', this.handleOffline);
  }

  // Rate-limiting repeated triggers within 1.5 seconds (e.g. rapid blur + visibility change)
  private shouldThrottle(eventType: string): boolean {
    const now = Date.now();
    const last = this.debounceMap.get(eventType) || 0;
    if (now - last < 1500) {
      return true;
    }
    this.debounceMap.set(eventType, now);
    return false;
  }

  private triggerViolation(
    eventType: SecurityEventType,
    details: string,
    severity: 'warning' | 'critical' = 'warning'
  ): void {
    if (!this.isExamActive) return;
    if (this.shouldThrottle(eventType)) return;

    const { violationsCount, isTerminated } = recordSecurityViolation(
      this.candidateId,
      eventType,
      details,
      severity
    );

    let level: 1 | 2 | 3 = 1;
    let title = 'SECURITY NOTICE: VIOLATION DETECTED';
    let message = 'Please return to the assessment. Further violations may lead to immediate termination.';

    if (violationsCount === 1) {
      level = 1;
      title = `${eventType.replace('_', ' ')} — Warning 1 of 2`;
      message = 'Please return to the assessment window immediately. Further violations may terminate your assessment.';
    } else if (violationsCount === 2) {
      level = 2;
      title = 'FINAL WARNING (Warning 2 of 2)';
      message = 'Another security violation will immediately terminate your assessment. Your screen and navigation activity are being logged.';
    } else {
      level = 3;
      title = 'ASSESSMENT TERMINATED';
      message = 'Your assessment has been permanently terminated due to repeated security policy violations. Your logged activity has been submitted to the Brainovision Talent Acquisition Team.';
      this.deactivate();
    }

    this.onViolation({
      eventType,
      level,
      title,
      message,
      violationsCount,
      isTerminated,
    });
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.triggerViolation(
        'TAB_SWITCH',
        'Candidate switched away from the assessment tab or minimized the browser window.'
      );
    }
  };

  private handleWindowBlur = (): void => {
    this.triggerViolation(
      'WINDOW_BLUR',
      'Candidate clicked outside the assessment window or engaged another active application.'
    );
  };

  private handleFullscreenChange = (): void => {
    if (!document.fullscreenElement) {
      this.triggerViolation(
        'FULLSCREEN_EXIT',
        'Candidate exited mandatory fullscreen mode.',
        'warning'
      );
    }
  };

  private handleCopy = (e: ClipboardEvent): void => {
    e.preventDefault();
    this.triggerViolation(
      'COPY_ATTEMPT',
      'Unauthorized clipboard copy attempt intercepted and blocked.'
    );
  };

  private handleCut = (e: ClipboardEvent): void => {
    e.preventDefault();
    this.triggerViolation(
      'CUT_ATTEMPT',
      'Unauthorized clipboard cut attempt intercepted and blocked.'
    );
  };

  private handlePaste = (e: ClipboardEvent): void => {
    e.preventDefault();
    this.triggerViolation(
      'PASTE_ATTEMPT',
      'Unauthorized clipboard paste attempt intercepted and blocked.'
    );
  };

  private handleContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    this.triggerViolation(
      'RIGHT_CLICK',
      'Unauthorized right-click context menu attempt intercepted and blocked.'
    );
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Intercept Alt+Tab, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+Shift+I, F12, F11, Escape
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (
      (isCtrlOrCmd && ['c', 'v', 'x', 'a', 'u', 'p', 's', 'r'].includes(e.key.toLowerCase())) ||
      (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
      ['F12', 'F11'].includes(e.key)
    ) {
      e.preventDefault();
      this.triggerViolation(
        'KEYBOARD_SHORTCUT',
        `Blocked prohibited keyboard shortcut: ${e.key} (Modifier: ${isCtrlOrCmd ? 'Ctrl/Cmd' : 'None'}).`
      );
    }
  };

  private handleBeforeUnload = (e: BeforeUnloadEvent): void => {
    if (this.isExamActive) {
      e.preventDefault();
      e.returnValue = 'Assessment in progress. Navigating away will be recorded as a violation.';
    }
  };

  private handleOffline = (): void => {
    this.triggerViolation(
      'SESSION_DISCONNECT',
      'Network connection interrupted. Local answers are preserved in auto-save cache.',
      'warning'
    );
  };

  // Helper static methods
  public static async enterFullscreen(): Promise<boolean> {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Fullscreen request rejected or not allowed by browser permissions', err);
      return false;
    }
  }

  public static async exitFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen failed', err);
    }
  }
}
