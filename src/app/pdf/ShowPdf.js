import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "react-bootstrap";
import { getAllInitial, getPdfForStudent, getPdfForTeacher , getAllRooms,getPdfForRoom } from '../api/pdf';

export default function ShowPdf() {

    const [forStudent, setForStudent] = useState(true);
    const [forTeacher, setForTeacher] = useState(false);
    const [forRoom, setForRoom] = useState(false);



    const [initials, setInitials] = useState([]);

    useEffect(() => {
        getAllInitial().then((res) => {
            setInitials(res.initials);
        });
    }, []);

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getAllRooms().then((res) => {
            setRooms(res.rooms);
        });
    }, []);

    const [selectedInitial, setSelectedInitial] = useState('');
    const handleSelectInitial = (selectedOption) => {
        setSelectedInitial(selectedOption);
    };
    const [selectedRoom, setSelectedRoom] = useState('');
    const handleSelectRoom = (selectedOption) => {
        setSelectedRoom(selectedOption);
    }

    const [lvlTerm, setLvlTerm] = useState('L4-T1');
    const [section, setSection] = useState('A');
    

    const [pdfData, setpdfData] = useState('');

    const handleSelect = (e) => {
        const selectedOption = e.target.value;
        console.log(selectedOption);
        setForStudent(false);
        setForTeacher(false);
        setForRoom(false);

        switch (selectedOption) {
            case 'For Student':
                setForStudent(true);
                break;
            case 'For Teacher':
                setForTeacher(true);
                break;
            case 'For Room':
                setForRoom(true);
                break;
            default:
                break;
        }
    };


    const handleRadioChange = (event) => {
        setLvlTerm(event.target.value);
    };
    const handleRadioChangeSection = (event) => {
        setSection(event.target.value);
    };

   

    const displayPdf = () => {
        try {
            if (forStudent) {
                getPdfForStudent(lvlTerm, section).then((res) => {
                    const pdfBlob = new Blob([res], { type: 'application/pdf' });
                    setpdfData(pdfBlob);
                });
            } else if (forTeacher) {
                getPdfForTeacher(selectedInitial).then((res) => {
                    const pdfBlob = new Blob([res], { type: 'application/pdf' });
                    setpdfData(pdfBlob);
                });
            } else if (forRoom) {
                getPdfForRoom(selectedRoom).then((res) => {
                    const pdfBlob = new Blob([res], { type: 'application/pdf' });
                    setpdfData(pdfBlob);
                });
            }
        } catch (err) {
            console.log(err);
        }
    }




    return (

        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>select type</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={handleSelect}
                            style={{ width: "25%" }}
                        >
                            <option value={'For Student'}>For Student</option>
                            <option value={'For Teacher'}>For Teacher</option>
                            <option value={'For Room'}>For Room</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            {forStudent &&
                <>
                    <Row className="mb-3">
                        <Col>
                            <Form>
                                <FormGroup>
                                    <div key="inline-radio" className="d-flex align-items-center">
                                        <Form.Check
                                            inline
                                            label="L4-T1"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            value="L4-T1"
                                            checked={lvlTerm === 'L4-T1'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="L3-T2"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            value="L3-T2"
                                            checked={lvlTerm === 'L3-T2'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="L2-T2"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            value="L2-T2"
                                            checked={lvlTerm === 'L2-T2'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="L1-T2"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            value="L1-T2"
                                            checked={lvlTerm === 'L1-T2'}
                                            onChange={handleRadioChange}
                                        />
                                    </div>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form>
                                <FormGroup>
                                    <div key="inline-radio" className="d-flex align-items-center">
                                        <Form.Check
                                            inline
                                            label="A"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            value="A"
                                            checked={section === 'A'}
                                            onChange={handleRadioChangeSection}
                                        />
                                        <Form.Check
                                            inline
                                            label="B"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            value="B"
                                            checked={section === 'B'}
                                            onChange={handleRadioChangeSection}
                                        />
                                    </div>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </>
            }


            {forTeacher &&
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>select initial</Form.Label>
                            <Form.Control as="select" style={{ width: "25%" }} onChange={(e) => handleSelectInitial(e.target.value)}>
                                {initials.map((item) => (
                                    <option key={item.iinitial} value={item.initial}>
                                        {item.initial}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                    </Col>
                </Row>
            }
            {forRoom &&
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>select room</Form.Label>
                            <Form.Control as="select" style={{ width: "25%" }} onChange={(e) => handleSelectRoom(e.target.value)}>
                                {rooms.map((item) => (
                                    <option key={item.iinitial} value={item.room}>
                                        {item.room}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            }

            <Row className="mb-3">
                <Col>
                    <Button variant="primary" onClick={displayPdf}>Show</Button>
                </Col>
            </Row>

            {pdfData && (
                <Row>
                    <Col>
                        <div>
                            <iframe
                                title="PDF Viewer"
                                src={URL.createObjectURL(pdfData)}
                                width="100%"
                                height="600px"
                            />
                        </div>
                    </Col>
                </Row>
            )}
        </Container>

    )
}