import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import ListItem from '@mui/material/ListItem';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import AuthContext from '../auth';
import { React, useContext, useState } from "react";

function CommentBox(props) {
    const {store} = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    let editItems = "";

    function addComment(event)
    {
        if (event.code === "Enter") {
            let text = event.target.value;
            let comment = [];
            comment.push(auth.user.email)
            comment.push(text)
            props.idNamePair.comments.push(comment)
            store.updateListPairs(props.idNamePair._id)
            event.target.blur()
        }
    }
    let pub = props.idNamePair.published

    if(props.idNamePair){
        editItems = 
            <List sx={{ width: '100%',height : "225px", bgcolor: `${ !pub ? "beige" : "gray"}`, overflowY:"auto"}}>
                {
                    props.idNamePair.comments.map((item) => (
                        <Box sx = {{fontSize: '12pt',
                        width: '100%',
                        height: '45px',
                        back: 'black',
                        fontWeight:"bold",
                        backgroundColor: "green",
                        borderRadius: 3,
                        border: "solid black",
                        mb : 1
                        }} >
                            {item[0]}
                            <Box style={{
                                fontSize: '10pt',
                                width: '100%',
                                height: '35px',
                                back: 'black',
                                fontWeight:"normal"
                            }}>
                                {item[1]}
                            </Box>
                        </Box>
                    ))
                }
            </List>;
    }

    if(props.idNamePair.published){
        return(
            <div id="top5-CommentBox">
                {editItems}
                {auth.user.email !== "guest@guest.com"?<input placeholder = "Add Comment" 
                style = {{width : "100%",height: "52px"}} 
                type = "text"
                onKeyDown = {addComment}
                />:<div></div>}
            </div>
        )
    }
    return(
        <div id="top5-CommentBox">
                The List has not yet been published
        </div>
    )
}

export default CommentBox;