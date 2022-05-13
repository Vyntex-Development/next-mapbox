import useForm from "../hooks/useForm";
import Input from "../components/UI/Input";

const Form = (props) => {
  let content;

  const {
    onChangeHandler,
    data,
    formConfig,
    validateInputFields,
    formIsValid,
  } = useForm(props.formConfig);

  const submitFormHandler = (ev) => {
    ev.preventDefault();
    validateInputFields();
    if (!formIsValid()) return;
    props.onSubmit(data);
  };

  if (props.loading) {
    content = <p>Loading....</p>;
  } else {
    content = (
      <div>
        <form onSubmit={submitFormHandler} noValidate>
          {formConfig.map((c) => {
            return <Input key={c.id} config={c} onChange={onChangeHandler} />;
          })}
          {props.children}
        </form>
      </div>
    );
  }

  return content;
};

export default Form;
