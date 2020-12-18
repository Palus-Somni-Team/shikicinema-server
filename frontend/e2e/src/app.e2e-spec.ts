import { AppPage } from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/admin/dashboard');
    });
    it('should get dashboard', () => {
      expect(page.getParagraphText()).toContain('dashboard');
    });
  });
});
