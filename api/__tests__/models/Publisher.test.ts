import Publisher from '../../models/Publisher';

describe('Publisher Model', () => {
  it('should be defined', () => {
    expect(Publisher).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(Publisher.tableName).toBe('Publishers');
  });

  it('should have required name attribute', () => {
    const attributes = Publisher.getAttributes();
    expect(attributes.name).toBeDefined();
    expect(attributes.name.allowNull).toBe(false);
  });

  it('should have unique constraint on name', () => {
    const attributes = Publisher.getAttributes();
    expect(attributes.name.unique).toBe(true);
  });

  it('should have optional country attribute', () => {
    const attributes = Publisher.getAttributes();
    expect(attributes.country).toBeDefined();
  });

  it('should have optional foundedYear attribute', () => {
    const attributes = Publisher.getAttributes();
    expect(attributes.foundedYear).toBeDefined();
  });

  it('should have optional website attribute', () => {
    const attributes = Publisher.getAttributes();
    expect(attributes.website).toBeDefined();
  });
});
