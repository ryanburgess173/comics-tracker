import { Component, inject, OnInit, signal } from "@angular/core";
import { ComicService } from "../../services/comic.service";
import { Comic } from "../../models/comic.model";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'comic-details',
    imports: [],
    templateUrl: './comic-details.component.html',
    styleUrl: './comic-details.component.scss',
})
export class ComicDetailsPageComponent implements OnInit {
    private comicsService = inject(ComicService);
    protected comic = signal<Comic>({
        id: 0,
        title: '',
        issueNumber: 0,
        releaseDate: new Date(),
        publisherId: 0,
        universeId: 0,
    });
    private comicId: number = 0;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.comicId = Number(this.route.snapshot.queryParamMap.get('id'));
        this.loadComic();
    }

    private loadComic() {
        this.comicsService.getComicById(this.comicId).subscribe({
            next: (data) => {
                this.comic.set(data as unknown as Comic);
            },
            error: (error) => console.error('Error loading comic: ', error),
        });
    }
}