import React from 'react';
import { Link } from 'react-router-dom';
import '../css/post.css'

export const Post = ({ post }) => {
    console.log(post)
    const dateObject = new Date(post.date_created);
    //const date = dateObject.parse(post.date_created);
    const dateString = dateObject.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });
    return (
        <div className='message mt-2'>
            <div className="message-text"><span className="message-author">{post.username}:</span> {post.text}</div>
            <div className="message-date">{dateString}</div>
        </div>
    )
};

export default Post;