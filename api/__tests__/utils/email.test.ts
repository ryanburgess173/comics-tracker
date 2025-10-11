import logger from '../../utils/logger';

// Mock the logger
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// Mock nodemailer
const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

describe('Email Utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockClear();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('sendPasswordResetEmail', () => {
    describe('without email credentials (development mode)', () => {
      it('should log token when email credentials are not configured', async () => {
        // Remove email credentials
        delete process.env.EMAIL_USER;
        delete process.env.EMAIL_PASSWORD;

        // Import after env is set
        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'test@example.com';
        const token = 'test-reset-token-12345';
        const username = 'testuser';

        await sendPasswordResetEmail(to, token, username);

        // Verify logger was called with token
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining('Email credentials not configured'),
          to,
          token
        );
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining('Configure EMAIL_USER and EMAIL_PASSWORD')
        );
      });

      it('should not throw error when credentials are missing', async () => {
        delete process.env.EMAIL_USER;
        delete process.env.EMAIL_PASSWORD;

        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'test@example.com';
        const token = 'test-reset-token-12345';
        const username = 'testuser';

        // Should not throw an error
        await expect(sendPasswordResetEmail(to, token, username)).resolves.not.toThrow();
      });

      it('should not call sendMail when credentials are missing', async () => {
        delete process.env.EMAIL_USER;
        delete process.env.EMAIL_PASSWORD;

        const { sendPasswordResetEmail } = await import('../../utils/email');

        await sendPasswordResetEmail('test@example.com', 'token123', 'testuser');

        expect(mockSendMail).not.toHaveBeenCalled();
      });
    });

    describe('with email credentials configured', () => {
      beforeEach(() => {
        process.env.EMAIL_USER = 'test@example.com';
        process.env.EMAIL_PASSWORD = 'test-password';
        process.env.EMAIL_FROM = 'noreply@example.com';
        process.env.EMAIL_HOST = 'smtp.example.com';
        process.env.EMAIL_PORT = '587';
        process.env.FRONTEND_URL = 'https://example.com';
      });

      it('should send email with correct recipient and subject', async () => {
        // Need to reload module after env variables are set
        jest.resetModules();
        jest.mock('../../utils/logger', () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        }));
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'user@example.com';
        const token = 'test-token-123';
        const username = 'testuser';

        await sendPasswordResetEmail(to, token, username);

        expect(mockSendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            to: 'user@example.com',
            from: 'noreply@example.com',
            subject: 'Password Reset Request',
          })
        );
      });

      it('should include reset URL in email HTML content', async () => {
        jest.resetModules();
        jest.mock('../../utils/logger', () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        }));
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'user@example.com';
        const token = 'test-token-123';
        const username = 'JohnDoe';

        await sendPasswordResetEmail(to, token, username);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const callArgs = mockSendMail.mock.calls[0][0] as {
          html: string;
          text: string;
          from: string;
          to: string;
          subject: string;
        };
        const expectedUrl = 'https://example.com/reset-password/test-token-123';

        expect(callArgs.html).toContain(expectedUrl);
        expect(callArgs.html).toContain('JohnDoe');
        expect(callArgs.html).toContain('Reset Password');
        expect(callArgs.html).toContain('1 hour');
      });

      it('should include reset URL in email text content', async () => {
        jest.resetModules();
        jest.mock('../../utils/logger', () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        }));
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'user@example.com';
        const token = 'test-token-456';
        const username = 'JaneSmith';

        await sendPasswordResetEmail(to, token, username);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const callArgs = mockSendMail.mock.calls[0][0] as {
          html: string;
          text: string;
          from: string;
          to: string;
          subject: string;
        };
        const expectedUrl = 'https://example.com/reset-password/test-token-456';

        expect(callArgs.text).toContain(expectedUrl);
        expect(callArgs.text).toContain('JaneSmith');
        expect(callArgs.text).toContain('1 hour');
      });

      it('should use default FRONTEND_URL when not configured', async () => {
        delete process.env.FRONTEND_URL;

        jest.resetModules();
        jest.mock('../../utils/logger', () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        }));
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        await sendPasswordResetEmail('user@example.com', 'token789', 'testuser');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const callArgs = mockSendMail.mock.calls[0][0] as {
          html: string;
          text: string;
          from: string;
          to: string;
          subject: string;
        };
        const defaultUrl = 'http://localhost:3000/reset-password/token789';

        expect(callArgs.html).toContain(defaultUrl);
        expect(callArgs.text).toContain(defaultUrl);
      });

      it('should log success message when email is sent', async () => {
        jest.resetModules();
        const mockLogger = {
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        };
        jest.mock('../../utils/logger', () => mockLogger);
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'user@example.com';
        await sendPasswordResetEmail(to, 'token', 'user');

        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining('Password reset email sent'),
          to
        );
      });

      it('should handle email sending errors and log them', async () => {
        const emailError = new Error('SMTP connection failed');
        mockSendMail.mockRejectedValueOnce(emailError);

        jest.resetModules();
        const mockLogger = {
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        };
        jest.mock('../../utils/logger', () => mockLogger);
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        const to = 'user@example.com';

        await expect(sendPasswordResetEmail(to, 'token', 'user')).rejects.toThrow(
          'Failed to send password reset email'
        );

        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Failed to send password reset email'),
          to,
          expect.any(Error)
        );
      });

      it('should use EMAIL_FROM when configured', async () => {
        process.env.EMAIL_FROM = 'custom@example.com';

        jest.resetModules();
        jest.mock('../../utils/logger', () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        }));
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        await sendPasswordResetEmail('user@example.com', 'token', 'user');

        expect(mockSendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            from: 'custom@example.com',
          })
        );
      });

      it('should default EMAIL_FROM to EMAIL_USER when not set', async () => {
        delete process.env.EMAIL_FROM;

        jest.resetModules();
        jest.mock('../../utils/logger', () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        }));
        jest.mock('nodemailer', () => ({
          createTransport: jest.fn(() => ({
            sendMail: mockSendMail,
          })),
        }));

        const { sendPasswordResetEmail } = await import('../../utils/email');

        await sendPasswordResetEmail('user@example.com', 'token', 'user');

        expect(mockSendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            from: 'test@example.com', // Should use EMAIL_USER
          })
        );
      });
    });
  });
});
