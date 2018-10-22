import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from "../../services/posts.service";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import {Post} from '../../models/post.model'


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

  enteredTitle = "";
  enteredContent = "";
  isLoading:boolean = false;
  post :Post;
  form : FormGroup;
  imagePreview:any;
  private mode: string = 'create';
  private postId :string;
  

  constructor(public postsService: PostsService,public route:ActivatedRoute) {}

  ngOnInit(){
    this.form = new FormGroup({
      'title' : new FormControl(null,{
        validators:[Validators.required,Validators.minLength(3)]
      }),
      'content' : new FormControl(null,{
        validators:[Validators.required,Validators.minLength(3)]
      }),
      'image' : new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has('postId')){
          this.mode = "edit";
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe((postData)=>{  //Observable from httpCLient will automatically unsubscribe
            this.isLoading = false;
            this.post = {id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath};
            this.form.setValue({
              'title': this.post.title,
              'content' : this.post.content,
              'image' : this.post.imagePath
            })
          });
          
        }else{
          this.mode = "create";
          this.postId  = null;
        }
    })
  }

  onImagePicked(event:Event){
    console.log(event)
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity(); //update the value in form internally
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

  }

  onSavePost(form: NgForm) {
   
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content,this.form.value.image);
    }else{
      this.postsService.updatePosts(this.postId,this.form.value.title, this.form.value.content,this.form.value.image);
    }
  
    this.form.reset();
  }

}
