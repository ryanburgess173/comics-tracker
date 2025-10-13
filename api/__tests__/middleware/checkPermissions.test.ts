import { Request, Response, NextFunction } from 'express';
import RolePermissionXRef from '../../models/RolePermissionXRef';
import Permission from '../../models/Permission';

// Unmock the middleware for this test file
jest.unmock('../../middleware/checkPermissions');

// Mock the models
jest.mock('../../models/RolePermissionXRef');
jest.mock('../../models/Permission');
jest.mock('../../utils/logger');

// Import after unmocking
import { requirePermissions } from '../../middleware/checkPermissions';

interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    roles: number[];
  };
}

describe('requirePermissions Middleware', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: undefined,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() when user has all required permissions', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1, 2],
    };

    const mockRolePermissions = [
      { Permission: { name: 'comics:read' } },
      { Permission: { name: 'comics:write' } },
      { Permission: { name: 'users:read' } },
    ];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions(['comics:read', 'comics:write']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(RolePermissionXRef.findAll).toHaveBeenCalledWith({
      where: { roleId: [1, 2] },
      include: [{ model: Permission, attributes: ['name'] }],
    });
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 403 when user has no roles assigned', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [],
    };

    // Execute
    const middleware = requirePermissions(['comics:read']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Access denied. No roles assigned.',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when user is not defined (JWT middleware missing)', async () => {
    // Setup
    mockRequest.user = undefined;

    // Execute
    const middleware = requirePermissions(['comics:read']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Authentication required. No user information found.',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 when user lacks required permissions', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1],
    };

    const mockRolePermissions = [{ Permission: { name: 'comics:read' } }];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions(['comics:read', 'comics:write']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Access denied. Insufficient permissions.',
      required: ['comics:read', 'comics:write'],
      has: ['comics:read'],
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle null permissions gracefully', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1],
    };

    const mockRolePermissions = [{ Permission: null }, { Permission: { name: 'comics:read' } }];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions(['comics:read']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 500 when database query fails', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1],
    };

    (RolePermissionXRef.findAll as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    // Execute
    const middleware = requirePermissions(['comics:read']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error checking permissions',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should work with empty required permissions array', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1],
    };

    const mockRolePermissions = [{ Permission: { name: 'comics:read' } }];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions([]);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should work with multiple roles having overlapping permissions', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1, 2, 3],
    };

    const mockRolePermissions = [
      { Permission: { name: 'comics:read' } },
      { Permission: { name: 'comics:read' } }, // Duplicate from another role
      { Permission: { name: 'comics:write' } },
      { Permission: { name: 'users:read' } },
    ];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions(['comics:read', 'comics:write']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should validate correct roleId is passed to database query', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [5, 10, 15],
    };

    const mockRolePermissions = [{ Permission: { name: 'comics:read' } }];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions(['comics:read']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(RolePermissionXRef.findAll).toHaveBeenCalledWith({
      where: { roleId: [5, 10, 15] },
      include: [{ model: Permission, attributes: ['name'] }],
    });
  });

  it('should handle single role ID', async () => {
    // Setup
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1],
    };

    const mockRolePermissions = [
      { Permission: { name: 'comics:read' } },
      { Permission: { name: 'comics:write' } },
    ];

    (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

    // Execute
    const middleware = requirePermissions(['comics:read']);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(RolePermissionXRef.findAll).toHaveBeenCalledWith({
      where: { roleId: [1] },
      include: [{ model: Permission, attributes: ['name'] }],
    });
    expect(nextFunction).toHaveBeenCalled();
  });
});
