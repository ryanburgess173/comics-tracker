import Universe from '../../models/Universe';
import Run from '../../models/Run';
import Comic from '../../models/Comic';
import TradePaperback from '../../models/TradePaperback';
import Omnibus from '../../models/Omnibus';
import { setupAssociations } from '../../models/associations';

// Setup associations before running tests
setupAssociations();

describe('Model Associations', () => {
  describe('Universe and Run relationship', () => {
    it('should define Universe hasMany Runs', () => {
      const associations = Universe.associations;
      expect(associations.runs).toBeDefined();
      expect(associations.runs.associationType).toBe('HasMany');
    });

    it('should define Run belongsTo Universe', () => {
      const associations = Run.associations;
      expect(associations.universe).toBeDefined();
      expect(associations.universe.associationType).toBe('BelongsTo');
    });
  });

  describe('Run and Comic relationship', () => {
    it('should define Run hasMany Comics', () => {
      const associations = Run.associations;
      expect(associations.comics).toBeDefined();
      expect(associations.comics.associationType).toBe('HasMany');
    });

    it('should define Comic belongsTo Run', () => {
      const associations = Comic.associations;
      expect(associations.run).toBeDefined();
      expect(associations.run.associationType).toBe('BelongsTo');
    });
  });

  describe('TradePaperback and Comic many-to-many', () => {
    it('should define TradePaperback belongsToMany Comics', () => {
      const associations = TradePaperback.associations;
      expect(associations.comics).toBeDefined();
      expect(associations.comics.associationType).toBe('BelongsToMany');
    });

    it('should define Comic belongsToMany TradePaperbacks', () => {
      const associations = Comic.associations;
      expect(associations.tradePaperbacks).toBeDefined();
      expect(associations.tradePaperbacks.associationType).toBe('BelongsToMany');
    });
  });

  describe('Omnibus and Comic many-to-many', () => {
    it('should define Omnibus belongsToMany Comics', () => {
      const associations = Omnibus.associations;
      expect(associations.comics).toBeDefined();
      expect(associations.comics.associationType).toBe('BelongsToMany');
    });

    it('should define Comic belongsToMany Omnibuses', () => {
      const associations = Comic.associations;
      expect(associations.omnibuses).toBeDefined();
      expect(associations.omnibuses.associationType).toBe('BelongsToMany');
    });
  });
});
