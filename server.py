from flask import Flask
from flask import request
from flask import jsonify
import string
import random
import json
import re
from hashlib import md5, sha1, sha224, sha256, sha384, sha512
app = Flask(__name__)

numberlist = string.digits
specialcharslist = ["!", "@", "#", "$", "%", "&"]
letterslist = string.ascii_letters
special_characters = """!@#$%^&*()-+?_=,<>/"""


@app.route("/generate")
def generator():
    password = ""
    passwordlist = []

    numbers = random.choices(numberlist, k=random.randint(1, 100))
    letters = random.choices(letterslist, k=random.randint(1, 100))
    specialchar = random.choice(specialcharslist)

    scramble = []
    for num in numbers:
        scramble.append(num)
    for letter in letters:
        scramble.append(letter)

    scramble.append(specialchar)

    passwordlist += random.choices(scramble, k=random.randint(10, 16))

    passwordlist.insert(random.randint(0, 10), specialchar)

    random.shuffle(passwordlist)

    for character in passwordlist:
        password += character

    print("Your generated password: ", password)
    return {password: 1}
    # return password


@app.route("/passcheck", methods=["GET", "POST"])
def passcheck():
    password = ""
    dataGet = request.get_json(force=True)
    dataGet = json.dumps(dataGet)
    dataGet = dataGet.split('"')
    password = dataGet[3]
    # print("this is password: " + password)
    uppercount = 0
    lowercount = 0
    specialcharcount = 0
    numbercount = 0
    length_grade = 0
    helperInfo = ""

    for letter in password:
        if letter in special_characters:
            continue
        if letter == letter.upper():
            uppercount = 1
        if letter == letter.lower():
            lowercount = 1
        if letter in numberlist:
            numbercount = 1
    if len(password) >= 8:
        length_grade = 1
    if len(password) >= 12:
        length_grade = 2
    if uppercount == 0:
        helperInfo += "Password needs an uppercase letter. "
        # print("Password needs an uppercase letter :(")
    if lowercount == 0:
        helperInfo += "Password needs a lowercase letter. "
        # print("Password needs a lowercase letter :(")

    if len(password) < 8:
        helperInfo += "Ensure password is at least 8 characters long. "
        # print("Ensure password is at least 8 characters long :(")
    else:
        print("Password has sufficient length :)")

    if any(char in special_characters for char in password):
        specialcharcount = 1
        print("Password has special characters :)")
    else:
        helperInfo += "Needs at least 1-2 special characters. "
        # print("Needs at least 1-2 special characters")

    pass_grade = length_grade + specialcharcount + \
        numbercount + uppercount + lowercount

    if pass_grade == 6:
        print("PTools Password Grade:  Excellent")
        return {"Excellent": helperInfo}
    if pass_grade == 5:
        print("PTools Password Grade:  Great")
        return {"Great": helperInfo}
    if pass_grade == 4:
        print("PTools Password Grade:  Good")
        return {"Good": helperInfo}
    if pass_grade <= 3:
        print("PTools Password Grade:  Bad")
        return {"Bad": helperInfo}


@app.route("/analyze", methods=["GET", "POST"])
def analyzeHash():
    passHash = ""
    dataGet = request.get_json(force=True)
    dataGet = json.dumps(dataGet)
    dataGet = dataGet.split('"')
    passHash = dataGet[3]
    print(passHash)

    if len(passHash) == 128:
        # resultbox.insert(1.0, "Hash type: SHA512")
        # print("Hash type: SHA512")
        return {"Hash type": "SHA512"}
    elif len(passHash) == 96:
        # resultbox.insert(1.0, "Hash type: SHA384")
        # print("Hash type: SHA384")
        return {"Hash type": "SHA384"}
    elif len(passHash) == 64:
        # resultbox.insert(1.0, "Hash type: SHA256")
        # print("Hash type: SHA256")
        return {"Hash type": "SHA256"}
    elif len(passHash) == 40:
        # resultbox.insert(1.0, "Hash type: SHA1")
        # print("Hash type: SHA1")
        return {"Hash type": "SHA1"}
    elif len(passHash) == 32:
        # resultbox.insert(1.0, "Hash type: MD5")
        # print("Hash type: MD5")
        return {"Hash type": "MD5"}
    elif len(passHash) == 56:
        # resultbox.insert(1.0, "Hash type: SHA224")
        # print("Hash type: SHA224")
        return {"Hash type": "SHA224"}
    else:
        # resultbox.insert(1.0, "Could not detect hash type. :(")
        # print("Could not detect hash type. :(")
        return {"Null": "Unable to find hash type."}


@app.route("/time2crack", methods=["GET", "POST"])
def timeCrack():
    passwd = ""
    crack_speed = 20000000000  # default assumed rate
    entropy = 0
    dataGet = request.get_json(force=True)
    dataGet = json.dumps(dataGet)
    dataGet = dataGet.split('"')
    passwd = dataGet[3]
    print(passwd)

    passwd_len = len(passwd)

    policies = {'Uppercase characters': 0,
                'Lowercase characters': 0,
                'Special characters': 0,
                'Numbers': 0
                }
    entropies = {'Uppercase characters': 26,
                 'Lowercase characters': 26,
                 'Special characters': 33,
                 'Numbers': 10
                 }

    for char in passwd:
        if re.match("[\[\] !\"#$%&'()*+,-./:;<=>?@\\^_`{|}~]", char):
            policies["Special characters"] += 1
        if re.match("[a-z]", char):
            policies["Lowercase characters"] += 1
        if re.match("[A-Z]", char):
            policies["Uppercase characters"] += 1
        if re.match("[0-9]", char):
            policies["Numbers"] += 1
    for policy in policies.keys():

        if policies[policy] > 0:
            entropy += entropies[policy]

    time_ = "minutes"
    speed = ((entropy**passwd_len) / crack_speed) / 60  # seconds in hour

    if speed > 60:
        speed = speed / 60
        time_ = "hour"

    if speed > 24:
        speed = speed / 24
        time_ = "days"

    if speed > 365:
        speed = speed / 365
        time_ = "years"

    if time_ == "years" and speed > 100:
        speed = speed / 100
        time_ = "centuries"

    if time_ == "centuries" and speed > 1000:
        speed = speed / 1000
        time_ = "millennia"

    if int(speed) < .01:
        # print("Time to crack password: {:,.9f} {}".format(speed, time_))
        return {"Time to crack password": "{:,.9f} {}".format(speed, time_)}
    if int(speed) > .01:
        return {"Time to crack password": "{:,.2f} {}".format(speed, time_)}


@app.route("/hashpassword", methods=["GET", "POST"])
def hash_pw():
    password = ""
    dataGet = request.get_json(force=True)
    dataGet = json.dumps(dataGet)
    print(dataGet)
    sha1pass = sha1(password.encode())
    sha224pass = sha224(password.encode())
    sha256pass = sha256(password.encode())
    sha384pass = sha384(password.encode())
    md5pass = md5(password.encode())

    return {"All 5 Hashes": ["md5=" + md5pass.hexdigest(), "sha1=" + sha1pass.hexdigest(), "sha224=" + sha224pass.hexdigest(), "sha256=" + sha256pass.hexdigest(), "sha384=" + sha384pass.hexdigest()]}

@app.route("/encrypt2hex", methods=["GET", "POST"])
def hex_encrypt():
    password = ""
    dataGet = request.get_json(force=True)
    dataGet = json.dumps(dataGet)
    dataGet = dataGet.split('"')
    password = dataGet[3]
    print(password)
    result = ""
    for character in password:
        modified_string = hex(ord(character)).replace("0x", "")
        if len(modified_string) == 1: modified_string = "0" + modified_string;
        result += modified_string
    print(result)
    return {"Encrypted to hex":result}

@app.route("/decrypthex", methods=["GET", "POST"])
def hex_decrypt():
    dataGet = request.get_json(force=True)
    dataGet = json.dumps(dataGet)
    dataGet = dataGet.split('"')
    hexData = dataGet[3]
    result = ""
    byte_array = bytearray.fromhex(hexData)
    result = byte_array.decode()

    return {"decrypted text":result}




if __name__ == "__main__":
    app.run(debug="True")
