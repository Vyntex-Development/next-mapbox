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

  const validate = (config, onKeyStroke = false) => {
    if (config.value.trim() === "") {
      config.isValid = false;
    } else {
      config.isValid = true;
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
    return formConfig.some((config) => config.inputConfig.isValid);
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
