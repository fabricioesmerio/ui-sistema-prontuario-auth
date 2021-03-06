import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticaService } from './authenticate.service';

export interface PatModel {
    registro?: string
    password_web?: string
}

export interface MedModel {
    login?: string
    cryptsenha?: string
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    @ViewChild('patientUser') patientUser: ElementRef
    @ViewChild('medicalUser') medicalUser: ElementRef

    patModel: PatModel = {};
    medModel: MedModel = {}
    title = 'ui-laudos';
    formBx: any;
    body: any;
    loading: boolean = false;

    constructor(
        private render: Renderer2,
        private toastr: ToastrService,
        private authService: AuthenticaService,
    ) { }


    ngAfterViewInit(): void {
        this.formBx = document.querySelector('.formBx')
        this.body = document.querySelector('body')
        requestAnimationFrame(() => {
            this.render.selectRootElement(this.patientUser.nativeElement).focus();
        })
    }

    onAction(action: 'signin' | 'signup') {
        if (action == 'signin') {
            this.formBx.classList.remove('active')
            this.body.classList.remove('active')
            requestAnimationFrame(() => {
                this.render.selectRootElement(this.patientUser.nativeElement).focus();
            })
        } else if (action == 'signup') {
            this.formBx.classList.add('active')
            this.body.classList.add('active')
            requestAnimationFrame(() => {
                this.render.selectRootElement(this.medicalUser.nativeElement).focus();
            })
        }
    }

    async authenticate(mode: 'medical' | 'patient') {
        if (this.formValidation(mode)) {
            try {
                this.loading = true
                let result = mode == 'patient'
                    ? await this.authService.authenticaPat(this.patModel)
                    : await this.authService.authenticaMed(this.medModel)

                    if (result.token) {
                        this.toastr.success(result.message, 'Sucesso!');
                        localStorage.setItem('tk', result.token)
                        localStorage.setItem('ty', mode == 'patient' ? 'P' : 'M')
                        window.location.href = 'http://devfabricio.tk/app'
                    }
    
                console.log('authenticate :: result ', result);
            } catch (err) {
                console.error(err)
                this.toastr.error(err, 'Erro!')
            } finally {
                this.loading = false
            }
        }
    }

    private formValidation(mode: 'medical' | 'patient') {
        if (mode == 'patient') {
            if (Object.keys(this.patModel).filter(item => [null, undefined, ''].includes(this.patModel[item]))[0]) {
                this.toastr.warning('Informe c??digo e senha', 'Aten????o!')
                return false;
            }
        } else {
            console.log(Object.keys(this.medModel).filter(item => [null, undefined, ''].includes(this.medModel[item])[0]))
            if (Object.keys(this.medModel).filter(item => [null, undefined, ''].includes(this.medModel[item]))[0]) {
                this.toastr.warning('Informe usu??rio e senha', 'Aten????o!')
                return;
            }
        }
        return true;
    }
}
