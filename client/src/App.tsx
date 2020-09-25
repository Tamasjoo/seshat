import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Link } from "react-router-dom";
import Browse from "./Browse";
import ShowAll from "./ShowAll";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row } from "react-bootstrap";

const App = () => {
    const [nav, setNav] = useState(""); // if we don´t want to hide the nav at some point we can also remove this because then probably we don´t want to change its state

    const [browseDocuments, setBrowseDocuments] = useState("");
    return (
        <Container>
            <BrowserRouter>
                <Row>
                    <Col className="bg-secondary" lg={2}>
                        <nav>
                            <Link to="/">
                                <Row>
                                    <button>Show All</button>
                                </Row>
                            </Link>
                            <Link to="/browse">
                                <Row>
                                    <button>Browse</button>
                                </Row>
                            </Link>
                            <Row>
                                <button>Upload</button>
                            </Row>
                        </nav>
                    </Col>
                    <Col>
                        <Row>
                            <div id="header_name">Name</div>
                            <div id="header_last_modified">
                                Last Modified On
                            </div>
                            <div id="header_size">Size</div>
                            <Route exact path="/" component={ShowAll} />
                            <Route path="/browse" component={Browse} />
                        </Row>
                    </Col>
                </Row>
            </BrowserRouter>
        </Container>
    );
};

export default App;
