import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Post } from "../../models/post.model";
import { PostsService } from "../../services/posts.service";
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

 // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSubs:Subscription;
  userIsAuthenticated = false
  isLoading:boolean = false;
  totalPosts= 0;
  pageSizePerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  constructor(public postsService: PostsService, private authService:AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSizePerPage,this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts:Post[],postCount:number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount
      });
      this.userIsAuthenticated = this.authService.getIsAuth();

      this.authStatusSubs = this.authService.getAuthListener().subscribe(isAuthenticated=>{
          this.userIsAuthenticated = isAuthenticated;
      })
  }

  onChangedPage(pageEvent: PageEvent){
    console.log(pageEvent)
    this.isLoading = true;
    this.currentPage= pageEvent.pageIndex + 1;
    this.pageSizePerPage =pageEvent.pageSize;
    this.postsService.getPosts(this.pageSizePerPage,this.currentPage);
  }

  onDelete(postId:string){
    console.log(postId);
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe((next) => {
      console.log(next);
     this.postsService.getPosts(this.pageSizePerPage,this.currentPage);

    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe()
  }

}
