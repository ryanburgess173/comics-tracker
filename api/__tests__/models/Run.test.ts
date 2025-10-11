import Run from '../../models/Run';

describe('Run Model', () => {
  it('should be defined', () => {
    expect(Run).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(Run.tableName).toBe('Runs');
  });

  it('should have required seriesName attribute', () => {
    const attributes = Run.getAttributes();
    expect(attributes.seriesName).toBeDefined();
    expect(attributes.seriesName.allowNull).toBe(false);
  });

  it('should have universeId foreign key', () => {
    const attributes = Run.getAttributes();
    expect(attributes.universeId).toBeDefined();
  });
});
