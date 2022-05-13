import { useState, useEffect } from "react";

const useForm = (initialFormConfig) => {
  useEffect(() => {
    const updatedConfig = JSON.parse(JSON.stringify(initialFormConfig));
    updatedConfig.forEach((config) => {
      config.inputConfig.value = "";
    });
    setConfig(updatedConfig);
  }, []);

  const [formData, setFormData] = useState({});
  const [formConfig, setConfig] = useState([]);
  const update = (config, value, type) => {
    const { inputConfig } = config.find((c) => c.inputConfig.name === type);
    inputConfig.value = value;
    return config;
  };
  const updateFormConfig = (value, type) => {
    setConfig(update(formConfig, value, type));
  };

  const inputChangeHandler = (ev, type) => {
    updateFormConfig(ev.target.value, type);
    validateSingleInputFields(type);
    setFormData((prevState) => {
      return {
        ...prevState,
        [type]: ev.target.value,
      };
    });
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const validate = (config, onKeyStroke = false) => {
    config.errorMsg = "";
    config.isValid = true;

    if (config.value.trim() === "") {
      config.errorMsg = `${config.labelName} is required`;
      config.isValid = false;
    }

    if (config.value.trim() !== "" && config.name === "email") {
      let isValid = validateEmail(config.value.trim());
      config.errorMsg = !isValid && onKeyStroke ? `ex. name@example.com` : "";
      config.isValid = isValid;
    }

    if (
      config.value.trim() !== "" &&
      (config.name === "username" || config.name === "password")
    ) {
      let isValid = +config.value.length >= config.minLength;
      config.errorMsg =
        !isValid && onKeyStroke
          ? `${config.name} is too short(${config.value.length}/${config.minLength} char.)`
          : "";
      config.isValid = isValid;
    }
  };

  const validateSingleInputFields = (type) => {
    const updatedConfig = JSON.parse(JSON.stringify(formConfig));
    const { inputConfig } = updatedConfig.find(
      (config) => config.inputConfig.name === type
    );
    validate(inputConfig);
    setConfig(updatedConfig);
  };

  const validateInputFields = () => {
    const updatedConfig = JSON.parse(JSON.stringify(formConfig));
    updatedConfig.forEach((config) => {
      validate(config.inputConfig, true);
    });

    setConfig(updatedConfig);
  };

  const formIsValid = () => {
    return formConfig.every((config) => config.inputConfig.isValid);
  };

  return {
    onChangeHandler: inputChangeHandler,
    data: formData,
    formConfig,
    validateInputFields,
    formIsValid,
  };
};

export default useForm;
