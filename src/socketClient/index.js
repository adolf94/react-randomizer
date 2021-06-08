
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://hitlerpr-randomizer.herokuapp.com/";

const socket = socketIOClient(ENDPOINT);

export default socket