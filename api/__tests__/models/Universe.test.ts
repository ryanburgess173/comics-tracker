import Universe from '../../models/Universe';

describe('Universe Model', () => {
  it('should be defined', () => {
    expect(Universe).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(Universe.tableName).toBe('Universes');
  });

  it('should have required name attribute', () => {
    const attributes = Universe.getAttributes();
    expect(attributes.name).toBeDefined();
    expect(attributes.name.allowNull).toBe(false);
  });

  it('should have unique constraint on name', () => {
    const attributes = Universe.getAttributes();
    expect(attributes.name.unique).toBe(true);
  });

  it('should have optional publisher attribute', () => {
    const attributes = Universe.getAttributes();
    expect(attributes.publisher).toBeDefined();
  });

  it('should have optional description attribute', () => {
    const attributes = Universe.getAttributes();
    expect(attributes.description).toBeDefined();
  });
});
