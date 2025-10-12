import Run from './Run';
import Comic from './Comic';
import TradePaperback from './TradePaperback';
import Omnibus from './Omnibus';
import TradePaperbackComicXRef from './TradePaperbackComicXRef';
import OmnibusComicXRef from './OmnibusComicXRef';
import Universe from './Universe';
import User from './User';
import Role from './Role';
import Permission from './Permission';
import UserRoleXRef from './UserRoleXRef';
import RolePermissionXRef from './RolePermissionXRef';

// Define associations
export const setupAssociations = () => {
  // Universe has many Runs
  Universe.hasMany(Run, {
    foreignKey: 'universeId',
    as: 'runs',
  });

  // Each Run belongs to one Universe
  Run.belongsTo(Universe, {
    foreignKey: 'universeId',
    as: 'universe',
  });

  // One Run has many Comics
  Run.hasMany(Comic, {
    foreignKey: 'runId',
    as: 'comics',
  });

  // Each Comic belongs to one Run
  Comic.belongsTo(Run, {
    foreignKey: 'runId',
    as: 'run',
  });

  // Many-to-Many: TradePaperback <-> Comic
  TradePaperback.belongsToMany(Comic, {
    through: TradePaperbackComicXRef,
    foreignKey: 'tradePaperbackId',
    otherKey: 'comicId',
    as: 'comics',
  });

  Comic.belongsToMany(TradePaperback, {
    through: TradePaperbackComicXRef,
    foreignKey: 'comicId',
    otherKey: 'tradePaperbackId',
    as: 'tradePaperbacks',
  });

  // Many-to-Many: Omnibus <-> Comic
  Omnibus.belongsToMany(Comic, {
    through: OmnibusComicXRef,
    foreignKey: 'omnibusId',
    otherKey: 'comicId',
    as: 'comics',
  });

  Comic.belongsToMany(Omnibus, {
    through: OmnibusComicXRef,
    foreignKey: 'comicId',
    otherKey: 'omnibusId',
    as: 'omnibuses',
  });

  // Many-to-Many: User <-> Role
  User.belongsToMany(Role, {
    through: UserRoleXRef,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles',
  });

  Role.belongsToMany(User, {
    through: UserRoleXRef,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users',
  });

  // Many-to-Many: Role <-> Permission
  Role.belongsToMany(Permission, {
    through: RolePermissionXRef,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  });

  Permission.belongsToMany(Role, {
    through: RolePermissionXRef,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  });
};

export {
  Run,
  Comic,
  TradePaperback,
  Omnibus,
  TradePaperbackComicXRef,
  OmnibusComicXRef,
  Universe,
  User,
  Role,
  Permission,
  UserRoleXRef,
  RolePermissionXRef,
};
