import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import { setTheoryEmail,setScheduleEmail,setSessionalEmail } from "../api/dashboard";
import EditEmailModal from "./EditEmailModal";
import { toast } from "react-hot-toast";


export default function Emailtemplate({ theoryEmail, scheduleEmail, sessionalEmail }) {
    const [showModal, setShowModal] = useState(false);
    const [mask, setMask] = useState();
    const [editedEmail, setEditedEmail] = useState(theoryEmail);

    const handleEditClick = (type, email) => {
        setShowModal(true);
        setEditedEmail(email);
        setMask(type);
       
    }

    const handleClose = () => {
        setShowModal(false);
      }

    

    const handleSave = () => {
        setShowModal(false);
        const email={
            email:editedEmail
        }
        if(mask === "THEORY"){
            setTheoryEmail(email).then((res) => {
                toast.success("Theory Email Updated");
            });
        }else if(mask === "SCHEDULE"){
            setScheduleEmail(email).then((res) => {
                toast.success("Schedule Email Updated");
            });
        }else if(mask === "SESSIONAL"){
            setSessionalEmail(email).then((res) => {
                toast.success("Sessional Email Updated");
            }
            );
        }
    }

    return (
        <div className="row">
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title mb-5">Email Templates</h4>
                        <div
                            class="row flex-row flex-nowrap "
                            style={{ overflowX: "auto" }}
                        >
                            <Card
                                style={{ width: "28rem" }}
                                bg="light"
                                className="mr-3 col-4"
                            >
                                <Card.Body>
                                    <Card.Title>
                                        Theory Course{" "}
                                        <i className="mdi mdi-email-open-outline mdi-24px float-right"></i>{" "}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        For selecting course
                                    </Card.Subtitle>
                                    {
                                        theoryEmail &&
                                        <Card.Text>
                                            {theoryEmail}
                                        </Card.Text>
                                    }
                                    <Button variant="outline-success">Copy</Button>
                                    <Button variant="outline-primary" className="float-right" onClick={() => {
                                        handleEditClick("THEORY", theoryEmail)
                                        
                                    }}>
                                        Edit
                                    </Button>
                                </Card.Body>

                                

                            </Card>

                            <Card
                                style={{ width: "28rem" }}
                                bg="light"
                                className="mr-3 col-4"
                            >
                                <Card.Body>
                                    <Card.Title>
                                        Schedule Ask{" "}
                                        <i className="mdi mdi-email-open-outline mdi-24px float-right"></i>{" "}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        For asking schedule
                                    </Card.Subtitle>
                                    {
                                        scheduleEmail &&
                                        <Card.Text>
                                            {scheduleEmail}
                                        </Card.Text>
                                    }
                                    <Button variant="outline-success">Copy</Button>
                                    <Button variant="outline-primary" className="float-right" onClick={() => {
                                        handleEditClick("SCHEDULE", scheduleEmail)
                                        
                                    }}>
                                        Edit
                                    </Button>
                                </Card.Body>
                            </Card>


                            <Card
                                style={{ width: "28rem" }}
                                bg="light"
                                className="mr-3 col-4"
                            >
                                <Card.Body>
                                    <Card.Title>
                                        Sessional Schedule{" "}
                                        <i className="mdi mdi-email-open-outline mdi-24px float-right"></i>{" "}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        For selecting sessional
                                    </Card.Subtitle>
                                    {
                                        sessionalEmail &&
                                        <Card.Text>
                                            {sessionalEmail}
                                        </Card.Text>
                                    }
                                    <Button variant="outline-success">Copy</Button>
                                    <Button variant="outline-primary" className="float-right" onClick={() => {
                                        handleEditClick("SESSIONAL", sessionalEmail)
                                        
                                    }}>
                                        Edit
                                    </Button>
                                </Card.Body>
                            </Card>

                        </div>
                    </div>
                </div>
            </div>
   

        
            <EditEmailModal
        showModal={showModal}
        handleClose={handleClose}
        handleSave={handleSave}
        editedEmail={editedEmail}
        setEditedEmail={setEditedEmail}
        mask={mask}
      />
      </div>
    )
}