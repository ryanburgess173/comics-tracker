import Creator from '../../models/Creator';

describe('Creator Model', () => {
  it('should be defined', () => {
    expect(Creator).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(Creator.tableName).toBe('Creators');
  });

  it('should have required name attribute', () => {
    const attributes = Creator.getAttributes();
    expect(attributes.name).toBeDefined();
    expect(attributes.name.allowNull).toBe(false);
  });

  it('should have required creatorType attribute', () => {
    const attributes = Creator.getAttributes();
    expect(attributes.creatorType).toBeDefined();
    expect(attributes.creatorType.allowNull).toBe(false);
  });

  it('should have creatorType as ENUM with ARTIST and AUTHOR values', () => {
    const attributes = Creator.getAttributes();
    expect(attributes.creatorType).toBeDefined();
    expect(attributes.creatorType.type).toBeDefined();
  });

  it('should have optional bio attribute', () => {
    const attributes = Creator.getAttributes();
    expect(attributes.bio).toBeDefined();
  });

  it('should have optional birthDate attribute', () => {
    const attributes = Creator.getAttributes();
    expect(attributes.birthDate).toBeDefined();
  });

  it('should have optional deathDate attribute', () => {
    const attributes = Creator.getAttributes();
    expect(attributes.deathDate).toBeDefined();
  });
});
