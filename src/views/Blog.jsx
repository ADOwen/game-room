import React, { useState, useEffect } from 'react';
import Post from '../components/Post';


const Blog = ({ currentUser }) => {

    const [posts, setPosts] = useState(() => [])
    const [comment, setComment] = useState('')

    const getPosts = async () => {
        const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/posts')
        const data = await res.json()
        //console.log(data)
        return data
    }


    const loopThroughPosts = (listOfPosts) => {
        return listOfPosts.map(post => <Post key={post.id} post={post} />)
    }

    useEffect(async () => {
        const data = await getPosts();
        setPosts(data)
        return
    }, [])

    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const submitComment = async (e) => {
        e.preventDefault();
        const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/create/post', {
            headers: {
                'Content-Type': "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
                id: currentUser.id,
                username: currentUser.username,
                text: comment,
            })
        
        });
        console.log(currentUser)
        const data = await res.json()
        console.log(data)
        if (data.status === 'success') {
            console.log('yay')
        }
    }



    return (
        <div className="left-container-with-title">
            <h2 className="section-title">ChatBox</h2>
            <div className="chatbox-wrapper">
                <div className="chat-wrapper">
                    {loopThroughPosts(posts)}
                </div>
                <div className="chat-controls">
                    <form onSubmit={(e)=>{submitComment(e)}} className="chat-form">
            
                        <label className="chat-label">
                            <input type="text" placeholder="Send a message" className="chat-input" onChange={handleChange} value={comment} />
                        </label>
                        <input type="submit" style={{ display: "none" }} />
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Blog;
