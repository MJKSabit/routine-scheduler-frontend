import React, { useState } from "react";
import { Container, Row, Col, Dropdown, DropdownButton, Form, FormGroup, Button } from "react-bootstrap";
import { getPdfForStudent } from '../api/pdf';

export default function ShowPdf() {

    const [forStudent, setForStudent] = useState(true);
    const [forTeacher, setForTeacher] = useState(false);
    const [forRoom, setForRoom] = useState(false);

    const [lvlTerm, setLvlTerm] = useState('L4-T1');
    const [section, setSection] = useState('A');

    const [pdfData, setpdfData] = useState('');

    const handleSelect = (selectedOption) => {
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
                    setpdfData(res);
                });
            }
        } catch (err) {
            console.log(err);
        }
    }




    return (

        <Container>
            <Row>
                <Col>
                    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                        <Dropdown.Item onClick={() => handleSelect('For Student')}>For Student</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSelect('For Teacher')}>For Teacher</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSelect('For Room')}>For Room</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
            <Row>

                {forStudent &&
                    <>
                        <Row>
                            <Col>
                                <div>
                                    <Form>
                                        <FormGroup>
                                            <div key="inline-radio" style={{ display: 'flex', alignItems: 'center' }}>
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
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form>
                                    <FormGroup>
                                        <div key="inline-radio" style={{ display: 'flex', alignItems: 'center' }}>
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
                        <Row>
                            <Col>
                                <Button variant="primary" onClick={displayPdf}>Primary</Button>
                            </Col>
                        </Row>

                    </>
                }
                {forTeacher && <div>Content for Teacher</div>}
                {forRoom && <div>Content for Room</div>}

            </Row>

            <Row>
                {pdfData && (
                    <object data={`data:application/pdf;base64,${pdfData}`} type="application/pdf" width="100%" height="600px">
                        <p>It appears you don't have a PDF plugin for this browser. You can <a href={`data:application/pdf;base64,${pdfData}`}>click here to download the PDF file.</a></p>
                    </object>
                )}

            </Row>
        </Container>

    )
}