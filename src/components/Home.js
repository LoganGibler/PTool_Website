import React, { useState, useEffect } from "react";
import { generatePath, NavLink, useHistory } from "react-router-dom";
import "./styles.css";

// const spawn = require('child_process').spawn;

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState("");
  let array = [];

  // generate password
  function Generate() {
    fetch("/generate")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        data = JSON.stringify(data);
        let password = "";
        for (let i = 2; i < data.length; i++) {
          const element = data[i];
          if (element == '"') {
            break;
          } else {
            password += element;
          }
        }
        document.getElementById("outputbox").innerText = password;
      });
  }

  // grade password
  function passcheck(inputdata) {
    let feedback = "";
    let finalGrade = "";
    var xml = new XMLHttpRequest();
    xml.open("POST", "/passcheck", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.onload = function () {
      var grade = JSON.stringify(this.responseText);
      grade = grade.split('"');
      finalGrade = grade[2];
      feedback = grade[4];
      feedback = feedback.slice(0, -1);
      finalGrade = finalGrade.slice(0, -1);
      let outputbox = document.getElementById("outputbox");
      outputbox.textContent = "Grade: " + finalGrade;
      outputbox.textContent += "\nSuggestions: " + feedback;
      console.log("Grade: " + finalGrade + "\nSuggestions: " + feedback);
    };
    let dataSend = JSON.stringify({ Password: [inputdata] });
    xml.send(dataSend);
    console.log("this is sent data", dataSend);
  }

  // analyze hash
  function analyzeHash(inputdata) {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/analyze", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.onload = function () {
      var hashtype = JSON.stringify(this.responseText);
      hashtype = hashtype.split('"');
      hashtype = hashtype[4];
      hashtype = hashtype.slice(0, -1);
      let outputbox = document.getElementById("outputbox");
      outputbox.textContent = "Hash Type: " + hashtype;
    };
    let dataSend = JSON.stringify({ "Hash this": [inputdata] });
    xml.send(dataSend);
  }

  // howlongtocrack
  function time2crack(inputdata) {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/time2crack", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.onload = function () {
      var time = JSON.stringify(this.responseText);
      time = time.split('"');
      time = time[4];
      time = time.slice(0, -1);
      let outputbox = document.getElementById("outputbox");
      outputbox.textContent = "Time to crack is: " + time;
    };
    let dataSend = JSON.stringify({ "Data sent": [inputdata] });
    xml.send(dataSend);
  }

  function hashPassword(inputdata) {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/hashpassword", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.onload = function () {
      let md5 = "";
      let sha1 = "";
      let sha224 = "";
      let sha256 = "";
      let sha384 = "";
      var hashedPasswords = JSON.stringify(this.responseText);
      hashedPasswords = hashedPasswords.split('"');
      md5 = hashedPasswords[4].slice(0, -1);
      sha1 = hashedPasswords[6].slice(0, -1);
      sha224 = hashedPasswords[8].slice(0, -1);
      sha256 = hashedPasswords[10].slice(0, -1);
      sha384 = hashedPasswords[12].slice(0, -1);
      let outputbox = document.getElementById("outputbox");
      outputbox.textContent = md5;
      outputbox.textContent += "\n" + sha1;
      outputbox.textContent += "\n" + sha224;
      outputbox.textContent += "\n" + sha256;
      outputbox.textContent += "\n" + sha384;
    };
    let dataSend = JSON.stringify({ "Data sent from js": [inputdata] });
    xml.send(dataSend);
  }

  function encrypt2hex(inputdata){
    var xml = new XMLHttpRequest();
    xml.open("POST", "/encrypt2hex", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.onload = function () {
      var hexData = JSON.stringify(this.responseText);
      hexData = hexData.split('"')
      hexData = hexData[4].slice(0,-1)
      let outputbox = document.getElementById("outputbox");
      outputbox.textContent = hexData
    };
    let dataSend = JSON.stringify({ "Data sent": [inputdata] });
    xml.send(dataSend);
  }

  function decryptHex(inputdata){
    var xml = new XMLHttpRequest();
    xml.open("POST", "/decrypthex", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.onload = function () {
      var textData = JSON.stringify(this.responseText);
      textData = textData.split('"')
      textData = textData[4].slice(0,-1)
      let outputbox = document.getElementById("outputbox");
      outputbox.textContent = textData
    };
    let dataSend = JSON.stringify({ "Data sent": [inputdata] });
    xml.send(dataSend);
  }




  return (
    <div id="maindiv">
      <header>
        <h1>Welcome to PTool!</h1>
      </header>
      <div id="inputboxdiv" type="text">
        <form id="inputform">
          <input
            id="inputbox"
            type="text"
            name="inputbox"
            className="inputbox"
            placeholder="Input Data Here:"
          ></input>
        </form>
      </div>

      <div id="buttondiv">
        <button
          id="generateButton"
          className="button"
          onClick={() => {
            Generate();
          }}
        >
          Generate
        </button>
        <button
          id="button2"
          className="button"
          onClick={() => {
            const inputdata = document.getElementById("inputbox").value;
            passcheck(inputdata);
          }}
        >
          Grade
        </button>
        <button
          id="button3"
          className="button"
          onClick={() => {
            const inputdata = document.getElementById("inputbox").value;
            analyzeHash(inputdata);
          }}
        >
          Analyze Hash
        </button>
        <button
          id="button4"
          className="button"
          onClick={() => {
            // history.push("/crack");
          }}
        >
          Crack Hash
        </button>
        <button
          id="button5"
          className="button"
          onClick={() => {
            // history.push("/lookup");
          }}
        >
          Dictionary Lookup
        </button>
        <button
          id="button6"
          className="button"
          onClick={() => {
            const inputdata = document.getElementById("inputbox").value;
            time2crack(inputdata);
          }}
        >
          Time to Crack
        </button>
        <button
          id="button7"
          className="button"
          onClick={() => {
            const inputdata = document.getElementById("inputbox").value;
            hashPassword(inputdata);
          }}
        >
          Hash Password
        </button>
        <button
          id="button8"
          className="button"
          onClick={() => {
            const inputdata = document.getElementById("inputbox").value;
            encrypt2hex(inputdata)
          }}
        >
          Encrypt to Hex
        </button>
        <button
          id="button9"
          className="button"
          onClick={() => {
            const inputdata = document.getElementById("inputbox").value;
            decryptHex(inputdata)
          }}
        >
          Decrypt Hex to Text
        </button>
      </div>

      <div id="outputboxdiv">
        <textarea id="outputbox" type="text" name="outputbox"></textarea>
      </div>

      <div id="buttondiv">
        <button
          id="button10"
          className="button"
          onClick={() => {
            // history.push("/base642text");
          }}
        >
          Base64 to Text
        </button>
        <button
          id="button11"
          className="button"
          onClick={() => {
            // history.push("/text2base64");
          }}
        >
          Text to Base64
        </button>
        <button
          id="button12"
          className="button"
          onClick={() => {
            // history.push("/binary");
          }}
        >
          Binary
        </button>
      </div>
    </div>
  );
};

export default Home;
