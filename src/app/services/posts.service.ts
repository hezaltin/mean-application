import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts(pagesize: number, page: number) {
    const queryParams = `?pagesize=${pagesize}&page=${page}`
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams).pipe(map((postData) => {
      console.log(postData)
      return {
        posts: postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        }),
        maxPosts: postData.maxPosts

      }
    })).subscribe((transformedPostData) => {
      console.log(transformedPostData)
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts })

    })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(p=> p.id === id)}
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {id:null,title: title, content: content};
    const postData = new FormData(); //javascript FormData method which allows the file type to send to backend
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe((next) => {
      console.log(next.message);
      // const post: Post = {
      //   id: next.post.id,
      //   title: title, 
      //   content: content ,
      //   imagePath: next.post.imagePath
      // }
      // this.posts.push(post);
      // this.postsUpdated.next({posts:[...this.posts],postCount:1});
      this.router.navigate(['/']);
    })

  }
  updatePosts(id: string, title: string, content: string, image: File | string) {
    console.log('id==>', id)
    console.log('title==>', title)
    console.log('content==>', content);
    console.log('image==>', image)
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      debugger
      postData = new FormData(); //javascript FormData method which allows the file type to send to backend
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }
    console.log(postData)

    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe((next) => {
      console.log(next);
      // const updatedPost = [...this.posts];
      // const oldPostIndex = updatedPost.findIndex(updatedPosts => updatedPosts.id === id);
      // const post :Post =  { id: id, title: title, content: content,imagePath:"" }
      // updatedPost[oldPostIndex] = post;
      // this.posts = updatedPost;
      // this.postsUpdated.next({posts:[...this.posts],postCount:1})
      this.router.navigate(['/']);
    })
  }

  deletePost(postId) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId);
  }

}
