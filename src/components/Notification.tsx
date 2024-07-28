import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Grid, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface Notification {
    id: string;
    message: string;
    read: boolean;
    timestamp: number; // Add timestamp field
}

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async () => {
        const q = query(collection(db, "notifications"), orderBy("timestamp", "desc")); // Query with ordering
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Notification[];
        setNotifications(data);
    };

    const addNotification = async (message: string) => {
        try {
            const docRef = await addDoc(collection(db, "notifications"), {
                message,
                read: false,
                timestamp: Date.now() // Add current timestamp
            });
            console.log(`Notification added with ID: ${docRef.id}`);
            fetchNotifications();
        } catch (error) {
            console.error("Error adding notification: ", error);
        }
    };

    const markAsRead = async (id: string) => {
        const notificationRef = doc(db, "notifications", id);
        await updateDoc(notificationRef, { read: true });
        fetchNotifications();
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div >
            <Grid container my={2} display="flex" justifyContent="center" >
                <Grid item xs={10} sm={8} md={6} lg={3} display="flex" justifyContent="space-around" >
                    <Button variant="outlined" sx={{borderRadius:2}} disableElevation onClick={() => addNotification("Notification 1")}>Notify 1</Button>
                    <Button variant="outlined" sx={{borderRadius:2}} disableElevation onClick={() => addNotification("Notification 2")}>Notify 2</Button>
                    <Button variant="outlined" sx={{borderRadius:2}} disableElevation onClick={() => addNotification("Notification 3")}>Notify 3</Button>
                </Grid>
            </Grid>
            <Grid container display="flex" justifyContent="center">
                <Grid item xs={10} sm={8} md={6}  >
                    <List>
                        {
                        notifications.length!==0?
                        notifications.map(notification => (
                            <ListItem disabled={notification.read} key={notification.id}
                            style={{ backgroundColor: notification.read ? "lightgrey" : "white", border: "1px solid #E6EBF1", marginTop: "10px", borderRadius: "12px" }}>
                                <ListItemText primary={notification.message} />
                                {notification.read ? <></> :
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Mark as Read" arrow placement="top">
                                        <IconButton edge="end" onClick={() => markAsRead(notification.id)} disabled={notification.read}>
                                            <CheckIcon />
                                        </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                }
                            </ListItem>
                        )):
                        <ListItem sx={{ backgroundColor: "white", border: "1px solid #E6EBF1", marginTop: "12px", borderRadius: "12px",textAlign:"center" }}>
                        <ListItemText primary="No Notification Yet" />
                    </ListItem>}
                    </List>

                </Grid>
            </Grid>

        </div>
    );
};

export default Notification;