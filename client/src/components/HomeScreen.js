import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import  AuthContext  from '../auth';
import DeleteModal from './DeleteModal'
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { borders, Box } from '@mui/system';


/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [text, setText] = useState(auth.user.email !== "guest@guest.com"?"Your Lists":"All Lists");
    const [menuOpen, setOpen] = useState(false);

    useEffect(() => {
        store.loadIdNamePairs(auth.email);
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    function funct1(){
        store.viewMode = 1;
        setText("Your Lists");
        store.loadIdNamePairs();
        console.log(store)
    }
    function funct2(){
        store.viewMode = 2;
        setText("All Lists");
        store.getAllLists2();
        console.log(store)
    }
    function funct3(){
        store.viewMode = 3;
        store.clearHome();
        setText("Lists");
        console.log(store)
    }
    function funct4(){
        store.viewMode = 4;
        store.clearHome();
        setText("Community Lists");
        console.log(store)
    }

    function searchPress(event){
        if(event.code == "Enter"){
            if(store.viewMode == "1"){
                setText("Your Lists")
                store.getAllLists1(event.target.value);
            }
            if(store.viewMode == "2"){
                setText(event.target.value+" Lists")
                store.getAllLists2(event.target.value);
            }
            if(store.viewMode == "3"){
                setText(event.target.value+"'s Lists")
                store.getAllLists3(event.target.value);
            }
            if(store.viewMode == "4"){
                store.getAllLists4(event.target.value);
            }
        }
    }

    function toggleOpen(){
        let temp = !menuOpen;
        setOpen(temp);
    }

    function sortDA(){
        store.idNamePairs.sort((a,b) =>{
            let firstY = a.publishDate.substring(0,4);
            let secondY = b.publishDate.substring(0,4);
            let firstM = a.publishDate.substring(5,7);
            let secondM = b.publishDate.substring(5,7);
            let firstD = a.publishDate.substring(8);
            let secondD = b.publishDate.substring(8);

            if(firstY > secondY)
                return 1;
            else if(firstY < secondY)
                return -1;

            if(firstM > secondM)
                return 1;
            else if(firstM < secondM)
                return -1;

            if(firstD > secondD)
                return 1;
            else if(firstD < secondD)
                return -1;

            return 0;
        })
        toggleOpen();
    }

    function sortDD(){
        store.idNamePairs.sort((a,b) =>{
            let firstY = a.publishDate.substring(0,4);
            let secondY = b.publishDate.substring(0,4);
            let firstM = a.publishDate.substring(5,7);
            let secondM = b.publishDate.substring(5,7);
            let firstD = a.publishDate.substring(8);
            let secondD = b.publishDate.substring(8);

            if(firstY < secondY)
                return 1;
            else if(firstY > secondY)
                return -1;

            if(firstM < secondM)
                return 1;
            else if(firstM > secondM)
                return -1;

            if(firstD < secondD)
                return 1;
            else if(firstD > secondD)
                return -1;

            return 0;
        })
        toggleOpen();
    }

    function sortV(){
        store.idNamePairs.sort((a,b) =>{
            if(a.views>b.views)
                return -1;
            if(a.views<b.views)
                return 1;
            return 0;
        })
        toggleOpen();
    }

    function sortL(){
        store.idNamePairs.sort((a,b) =>{
            if(a.likedBy.length>b.likedBy.length)
                return -1;
            if(a.likedBy.length<b.likedBy.length)
                return 1;
            return 0;
        })
        toggleOpen();
    }

    function sortD(){
        store.idNamePairs.sort((a,b) =>{
            if(a.dislikedBy.length>b.dislikedBy.length)
                return -1;
            if(a.dislikedBy.length<b.dislikedBy.length)
                return 1;
            return 0;
        })
        toggleOpen();
    }

    
    let sortMenu = 
        <Box style = {{right:"0%",top:"14.5%", position:"absolute",backgroundColor:"white"}} border = {1} borderColor = "black" zIndex = "999">   
                    <Button onClick = {sortDD}>Publish Date(Newest)</Button>
                <br/><Button onClick = {sortDA}>Publish Date(Oldest)</Button>
                <br/><Button fullWidth onClick = {sortV}>Views</Button>
                <br/><Button fullWidth onClick = {sortL}>Likes</Button>
                <br/><Button fullWidth onClick = {sortD}>Dislikes</Button>
        </Box>        

    let listCard = "";
    if (store.idNamePairs) {
        listCard = 
            <List sx={{ marginTop:"5%", width: '90%', left: '5%' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        viewMode={text}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="top5-list-selector">
            <Box>
                {auth.user.email !== "guest@guest.com"?<Button onClick = {funct1}><HomeIcon/></Button>:<div></div>}
                <Button onClick = {funct2}><GroupIcon/></Button>
                <Button onClick = {funct3}><PersonIcon/></Button>
                <Button onClick = {funct4}><FunctionsIcon/></Button>
                <TextField label = "Search" style = {{width : "40%"}} onKeyDown = {searchPress}></TextField>
                    <Button style = {{right:"0%", position:"absolute"}} onClick = {toggleOpen} >
                        Sort By
                        <MenuIcon
                            size="large"
                            color="inherit"
                        >
                        </MenuIcon>
                    </Button>
                    {menuOpen?sortMenu:<Box></Box>}
             </Box>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
            <div id="list-selector-heading">
            {auth.user.email !== "guest@guest.com"?<Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                style = {{marginTop : "17%" ,zIndex: "999"}}
            >
                <AddIcon />
            </Fab>
            :<div></div>
            }
                <Typography variant="h2" marginTop = "17%" zIndex = "999">{text}</Typography>
            </div>
            <DeleteModal/>
        </div>);
}

export default HomeScreen;