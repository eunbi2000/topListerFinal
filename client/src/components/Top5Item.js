import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState(props.text);
    let { index } = props;

    let itemClass = "top5-item";

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        console.log(props.index)
        if (event.code === "Enter") {
            let index = props.index;
            setText(event.target.value);
            store.currentList.items[index] = text;
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    if(editActive)
    {
        return(<TextField
            margin="normal"
            required
            fullWidth
            id={index}
            label="Top 5 List Name"
            name="name"
            autoComplete="Top 5 List Name"
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={text}
            inputProps={{style: {fontSize: 48}}}
            InputLabelProps={{style: {fontSize: 24}}}
            autoFocus
        />
        )
    }
    else
    return (
            <ListItem
                id={'item-' + (index+1)}
                key={props.key}
                className={itemClass}
                sx={{ display: 'flex', p: 1 }}
                style={{
                    fontSize: '48pt',
                    width: '100%'
                }}
            >
            <Box sx={{ p: 1 }}>
                <IconButton aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}}  onClick = {toggleEdit}/>
                </IconButton>
            </Box>
                <Box sx={{ p: 1, flexGrow: 1 }}>{text}</Box>
            </ListItem>
    )
}

export default Top5Item;