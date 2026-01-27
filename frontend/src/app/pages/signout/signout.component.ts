import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'signout-page',
    imports: [],
    templateUrl: './signout.component.html',
    styleUrl: './signout.component.scss',
})
export class SignOutPageComponent implements OnInit{
    private readonly authService = inject(AuthService);

    ngOnInit() {
        this.authService.logout();
    }
}