import "../../css/signin.css";
import React, { useState } from "react";
import API from "../../services/api";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import Swal from "sweetalert";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(0); // 0 for Female, 1 for Male
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Event handlers for input changes
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleDateOfBirthChange = (event) => {
    setDateOfBirth(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Construct the data object to be sent to the API
    const data = {
      Ho: lastName,
      Ten: firstName,
      GioiTinh: gender,
      NgaySinh: dateOfBirth,
      DiaChi: address,
      SDT: phone,
      Email: email,
      Password: password,
    };

    API.post("/customer/signUp", data)
      .then((response) => {
        if (response.data.success) {
          Swal({
            title: "Sign up success!",
            text: response.data.message,
            icon: "success",
            dangerMode: true,
          }).then(() => {
            // Chuyển hướng đến trang đăng nhập
            window.location.href = "/dlbwatchofficial/signin";
          });
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Đã có lỗi xảy ra trong quá trình đăng kí!");
        }
      });
  };

  return (
    <div class="form-account">
      <Header />
      <div class="form">
        <div class="account-container">
          <h1 class="h1-account">CREATE A DLB STORE ACCOUNT</h1>
          <p class="subtitle-container">
            Create your account to manage your profile, track your orders and
            more. Once it is set up, you will also be able to register your
            watch
          </p>
        </div>
        <div class="profile">
          <div class="profile-container">
            <h2 class="h2-profile">GENERAL INFORMATION</h2>
            <div class="info-blockform">
              <form onSubmit={handleSubmit}>
                {errorMessage && <div class="error">{errorMessage}</div>}

                <div className="inputname">
                  <div className="firstname">
                    <label class="label-account" htmlFor="firstName">
                      First name
                    </label>
                    <input
                      class="input-account"
                      type="text"
                      placeholder="Enter first name"
                      id="firstName"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      required
                    />
                  </div>
                  <div>
                    <label class="label-account" htmlFor="lastName">
                      Surname
                    </label>
                    <input
                      class="input-account"
                      type="text"
                      placeholder="Enter surname"
                      id="lastName"
                      value={lastName}
                      onChange={handleLastNameChange}
                      required
                    />
                  </div>
                </div>

                <div className="inputname">
                  <div className="firstname">
                    <label class="label-account" htmlFor="dateOfBirth">
                      Date of birth
                    </label>
                    <input
                      class="input-account"
                      type="date"
                      placeholder="Enter date of birth"
                      id="dateOfBirth"
                      value={dateOfBirth}
                      onChange={handleDateOfBirthChange}
                      required
                    />
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="label-account"
                        class="label-account"
                        variant="standard"
                        htmlFor="uncontrolled-native"
                      >
                        Gender
                      </InputLabel>
                      <NativeSelect
                        defaultValue={gender}
                        inputProps={{
                          name: 'gender',
                          id: 'uncontrolled-native',
                        }}
                        onChange={handleGenderChange}
                      >
                        <option value={0}>Female</option>
                        <option value={1}>Male</option>
                      </NativeSelect>
                    </FormControl>
                  </Box>
                </div>
                <div>
                  <label class="label-account" htmlFor="address">
                    Address
                  </label>
                  <input
                    class="input-account"
                    type="text"
                    id="address"
                    placeholder="Enter address"
                    value={address}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label class="label-account" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    class="input-account"
                    type="email"
                    placeholder="Email address"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>

                <div>
                  <label class="label-account" htmlFor="phone">
                    Mobile Phone Number
                  </label>
                  <input
                    class="input-account"
                    type="text"
                    id="phone"
                    placeholder="Mobile phone number"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>

                <div>
                  <label class="label-account" htmlFor="password">
                    Password
                  </label>
                  <input
                    class="input-account"
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div class="signinup-now">
                  <label class="label-acc">Already have an account? </label>
                  <Link to="/signin" class="link-signinup-now">
                    Sign In
                  </Link>
                </div>
                <div class="btn-access">
                  <button class="btn-account" type="submit">
                    CREATE MY ACCOUNT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
