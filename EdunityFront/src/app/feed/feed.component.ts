import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Tema';
import { User } from '../model/User';
import { AuthService } from '../service/auth.service';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  nome = environment.nome
  foto = environment.foto
  tipo = environment.tipo
  usuario = environment.usuario
  idUser = environment.id

  listaTemas: Tema[]
  tema: Tema = new Tema()
  idTema: number
  listaPostagens: Postagem[]
  postagem: Postagem = new Postagem()
  idPostagem: number
  user: User = new User()
  dataHora: Date 

  constructor(
    public auth: AuthService,
    private router: Router,
    private temaService: TemaService,
    private postagemService: PostagemService,
    private route: ActivatedRoute
    
  ) { }

  ngOnInit() {
    if (environment.token == ""){
      alert("Sua seção expirou, faça o login novamente.")
      this.router.navigate(["/login"])
    }

    this.findAllTemas()
    this.findAllPostagens()

    this.idPostagem = this.route.snapshot.params["id"]
    this.findByIdPostagem(this.idPostagem)
  }

  findAllTemas() {
    this.temaService.getAllTema().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findAllPostagens(){
    this.postagemService.getAllPostagem().subscribe((resp: Postagem[])=>{
      this.listaPostagens = resp
    })
  }

  findByIdTema(){
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema)=>{
      this.tema = resp
    })
  }

  findByIdPostagem(id: number){
    this.postagemService.getByIdPostagem(id).subscribe((resp: Postagem) => {
      this.postagem = resp
    })
  }

  publicar(){
    this.tema.id = this.idTema
    this.postagem.tema = this.tema
    this.user.id = this.idUser
    this.postagem.usuario = this.user

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem)=>{
      this.postagem = resp
      alert("Postagem feita com sucesso!")
      this.postagem = new Postagem()
      this.findAllPostagens()
    })

  }

  deletar(){
    this.postagemService.deletePostagem(this.idPostagem).subscribe(() =>{
      alert("Postagem apagada!")
      this.router.navigate(["/feed"])
    })
  }

  atualizar(){
    this.tema.id = this.idTema
    this.postagem.tema = this.tema
    this.postagem.date = this.dataHora
    this.postagemService.putPostagem(this.postagem).subscribe((resp: Postagem)=> {
      this.postagem = resp 
      alert("Postagem atualizada!")
      this.router.navigate(["/feed"])
    })
  }

  
  

}
