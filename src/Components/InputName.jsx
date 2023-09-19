import { useRef } from 'react';
import useGame from '../Stores/useGame';
import '../CSS/Media.css';

const InputName = ({ name, setName, playerEnable, setPlayerEnable }) => {
  const nameRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nameRef.current && nameRef.current.value) {
      setName(nameRef.current.value);
      setPlayerEnable(true);
    }
  }

  return (
    !playerEnable ? (
      <div className='name-container'>
        <form onSubmit={handleSubmit}>
          <input ref={nameRef} type="text" placeholder="Enter your name" defaultValue={name}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    ) : null
  );
};

export default InputName;
