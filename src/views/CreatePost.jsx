import React from 'react';


const CreatePost = ({currentUser}) => {
    
    const sendCredentials = async (e) => {
        e.preventDefault();
        const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/create/post', {
            headers: {
                'Content-Type': "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
               id: currentUser.id, 
               username: currentUser.username,
               text: e.target.text.value,
            })
        });
        const data = await res.json()
        console.log(data)
        if (data.status === 'success'){
            console.log('yay')
            
        }
    }

    return (
        <div className="container">
            <form onSubmit={(e) => {sendCredentials(e)}} >
                <input id="csrf_token" name="csrf_token" type="hidden" value="IjVkNmVhZTZjYzBkMzkxOGFlY2Q1ODMyZmRlNzhkNWY1ZmIwMzU2YTci.Ye8XrQ.W579hVJyjhRKRbv80vIw37VHsMY"/>
                    <div className="form-group">
                        <fieldset>
                            <label htmlFor="text"></label> <textarea className="form-control textArea" id="text" name="text" placeholder="Type your story here..." required=""></textarea>
                            <br/>
                        </fieldset>
                        <div align="center"><input className="btn btn-primary" id="submit" name="submit" type="submit" value="Post"/></div>
                    </div>
            </form>
        </div>
    )
}

export default CreatePost;
