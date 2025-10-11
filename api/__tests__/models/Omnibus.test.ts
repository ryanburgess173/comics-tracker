import Omnibus from '../../models/Omnibus';

describe('Omnibus Model', () => {
  it('should be defined', () => {
    expect(Omnibus).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(Omnibus.tableName).toBe('Omnibuses');
  });

  it('should have required title attribute', () => {
    const attributes = Omnibus.getAttributes();
    expect(attributes.title).toBeDefined();
    expect(attributes.title.allowNull).toBe(false);
  });

  it('should have optional isbn attribute with unique constraint', () => {
    const attributes = Omnibus.getAttributes();
    expect(attributes.isbn).toBeDefined();
    if (attributes.isbn) {
      expect(attributes.isbn.unique).toBe(true);
    }
  });

  it('should have optional volume attribute', () => {
    const attributes = Omnibus.getAttributes();
    expect(attributes.volume).toBeDefined();
  });

  it('should have optional pageCount attribute', () => {
    const attributes = Omnibus.getAttributes();
    expect(attributes.pageCount).toBeDefined();
  });
});
