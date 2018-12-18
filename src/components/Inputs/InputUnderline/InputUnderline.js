import Input from '../Input.js'
import styles from './InputUnderline.module.css'

class InputUnderline extends Input {
	styles = Object.assign({}, this.styles, styles);
}

export default InputUnderline