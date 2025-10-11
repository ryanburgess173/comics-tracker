import Comic from '../../models/Comic';

describe('Comic Model', () => {
  it('should be defined', () => {
    expect(Comic).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(Comic.tableName).toBe('Comics');
  });

  it('should have required title attribute', () => {
    const attributes = Comic.getAttributes();
    expect(attributes.title).toBeDefined();
    expect(attributes.title.allowNull).toBe(false);
  });

  it('should have required author attribute', () => {
    const attributes = Comic.getAttributes();
    expect(attributes.author).toBeDefined();
    expect(attributes.author.allowNull).toBe(false);
  });

  it('should have variant attribute with default value', () => {
    const attributes = Comic.getAttributes();
    expect(attributes.variant).toBeDefined();
    if (attributes.variant) {
      expect(attributes.variant.defaultValue).toBe(1);
    }
  });

  it('should have runId foreign key', () => {
    const attributes = Comic.getAttributes();
    expect(attributes.runId).toBeDefined();
  });
});
