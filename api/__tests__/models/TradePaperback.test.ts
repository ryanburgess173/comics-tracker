import TradePaperback from '../../models/TradePaperback';

describe('TradePaperback Model', () => {
  it('should be defined', () => {
    expect(TradePaperback).toBeDefined();
  });

  it('should have correct table name', () => {
    expect(TradePaperback.tableName).toBe('TradePaperbacks');
  });

  it('should have required title attribute', () => {
    const attributes = TradePaperback.getAttributes();
    expect(attributes.title).toBeDefined();
    expect(attributes.title.allowNull).toBe(false);
  });

  it('should have optional isbn attribute with unique constraint', () => {
    const attributes = TradePaperback.getAttributes();
    expect(attributes.isbn).toBeDefined();
    if (attributes.isbn) {
      expect(attributes.isbn.unique).toBe(true);
    }
  });

  it('should have optional volume attribute', () => {
    const attributes = TradePaperback.getAttributes();
    expect(attributes.volume).toBeDefined();
  });

  it('should have optional pageCount attribute', () => {
    const attributes = TradePaperback.getAttributes();
    expect(attributes.pageCount).toBeDefined();
  });
});
