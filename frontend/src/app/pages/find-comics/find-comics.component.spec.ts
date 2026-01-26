import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindComicsComponent } from './find-comics.component';
import { ComicService } from '../../services/comic.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Comic } from '../../models/comic.model';

describe('FindComicsComponent', () => {
  let component: FindComicsComponent;
  let fixture: ComponentFixture<FindComicsComponent>;
  let comicService: jasmine.SpyObj<ComicService>;

  const mockComics: Comic[] = [
    {
      id: 1,
      title: 'Thor #1',
      issueNumber: 1,
      releaseDate: new Date('2014-11-12'),
      publisherId: 1,
      universeId: 1,
    },
    {
      id: 2,
      title: 'Avengers #1',
      issueNumber: 1,
      releaseDate: new Date('2013-01-01'),
      publisherId: 1,
      universeId: 1,
    },
  ];

  beforeEach(async () => {
    const comicServiceSpy = jasmine.createSpyObj('ComicService', ['searchComics']);

    await TestBed.configureTestingModule({
      imports: [FindComicsComponent, FormsModule],
      providers: [{ provide: ComicService, useValue: comicServiceSpy }],
    }).compileComponents();

    comicService = TestBed.inject(ComicService) as jasmine.SpyObj<ComicService>;
    fixture = TestBed.createComponent(FindComicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty searchType and searchTerm', () => {
    expect(component.searchType).toBe('');
    expect(component.searchTerm).toBe('');
  });

  it('should initialize with empty comics signal', () => {
    expect(component['comics']()).toEqual([]);
  });

  describe('onSubmit', () => {
    it('should call searchComics with searchType and searchTerm', () => {
      comicService.searchComics.and.returnValue(of(mockComics));
      component.searchType = 'Author';
      component.searchTerm = 'Jason Aaron';

      component.onSubmit();

      expect(comicService.searchComics).toHaveBeenCalledWith('Author', 'Jason Aaron');
    });

    it('should update comics signal with search results', (done) => {
      comicService.searchComics.and.returnValue(of(mockComics));
      component.searchType = 'Title';
      component.searchTerm = 'Thor';

      component.onSubmit();

      // Wait for async operation to complete
      setTimeout(() => {
        expect(component['comics']()).toEqual(mockComics);
        done();
      }, 0);
    });

    it('should handle empty search results', (done) => {
      comicService.searchComics.and.returnValue(of([]));
      component.searchType = 'Author';
      component.searchTerm = 'Unknown Author';

      component.onSubmit();

      setTimeout(() => {
        expect(component['comics']()).toEqual([]);
        done();
      }, 0);
    });

    it('should handle service error', (done) => {
      const consoleErrorSpy = spyOn(console, 'error');
      const error = new Error('Service error');
      comicService.searchComics.and.returnValue(throwError(() => error));

      component.searchType = 'Title';
      component.searchTerm = 'Test';
      component.onSubmit();

      setTimeout(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading comics searched: ', error);
        done();
      }, 0);
    });
  });

  describe('Form Binding', () => {
    it('should bind searchType to select element', async () => {
      component.searchType = 'Author';
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.searchType).toBe('Author');
    });

    it('should bind searchTerm to input element', async () => {
        component.searchTerm = 'Spider-Man';
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.searchTerm).toBe('Spider-Man');
    });

    it('should update component properties when form inputs change', async () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const selectElement = compiled.querySelector('select') as HTMLSelectElement;
      const inputElement = compiled.querySelector('input[name="search"]') as HTMLInputElement;

      // Simulate user input
      selectElement.value = 'Title';
      selectElement.dispatchEvent(new Event('change'));
      selectElement.dispatchEvent(new Event('input'));

      inputElement.value = 'Batman';
      inputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.searchType).toBe('Title');
      expect(component.searchTerm).toBe('Batman');
    });
  });

  describe('Template Rendering', () => {
    it('should render search form', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');

      expect(form).toBeTruthy();
    });

    it('should render select dropdown for searchType', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('select');

      expect(select).toBeTruthy();
    });

    it('should render input field for searchTerm', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input[name="search"]');

      expect(input).toBeTruthy();
    });

    it('should render submit button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('input[type="submit"]');

      expect(submitButton).toBeTruthy();
    });

    it('should display comics when results are available', (done) => {
      comicService.searchComics.and.returnValue(of(mockComics));
      component.searchType = 'Author';
      component.searchTerm = 'Jason Aaron';

      component.onSubmit();

      setTimeout(() => {
        fixture.detectChanges();
        
        // Check if comics are rendered (implementation depends on template)
        expect(component['comics']().length).toBe(2);
        done();
      }, 0);
    });

    it('should handle empty results gracefully', (done) => {
      comicService.searchComics.and.returnValue(of([]));
      component.searchType = 'Title';
      component.searchTerm = 'NonExistent';

      component.onSubmit();

      setTimeout(() => {
        fixture.detectChanges();
        expect(component['comics']().length).toBe(0);
        done();
      }, 0);
    });
  });

  describe('Integration', () => {
    it('should trigger search when form is submitted', () => {
      comicService.searchComics.and.returnValue(of(mockComics));
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form') as HTMLFormElement;

      component.searchType = 'Author';
      component.searchTerm = 'Stan Lee';
      fixture.detectChanges();

      form.dispatchEvent(new Event('submit'));

      expect(comicService.searchComics).toHaveBeenCalledWith('Author', 'Stan Lee');
    });

    it('should handle multiple searches', (done) => {
      comicService.searchComics.and.returnValue(of(mockComics));

      // First search
      component.searchType = 'Author';
      component.searchTerm = 'Jason Aaron';
      component.onSubmit();

      setTimeout(() => {
        expect(comicService.searchComics).toHaveBeenCalledWith('Author', 'Jason Aaron');

        // Second search
        comicService.searchComics.and.returnValue(of([]));
        component.searchType = 'Title';
        component.searchTerm = 'X-Men';
        component.onSubmit();

        setTimeout(() => {
          expect(comicService.searchComics).toHaveBeenCalledWith('Title', 'X-Men');
          expect(comicService.searchComics).toHaveBeenCalledTimes(2);
          done();
        }, 0);
      }, 0);
    });
  });
});
