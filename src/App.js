import React from 'react';
import PropTypes from 'prop-types';
import { getColor, easeOut } from './Utils';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import './App.css';

class Roulette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinAngleStart: 0,
      startAngle: 0,
      spinTime: 0,
      arc: Math.PI / (props.options.length / 2),
      text: '',
    };
    this.spinTimer = null;
    this.handleOnClick = this.handleOnClick.bind(this);
    this.spin = this.spin.bind(this);
    this.rotate = this.rotate.bind(this);
  }

  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    baseSize: PropTypes.number,
    spinAngleStart: PropTypes.number,
    spinTimeTotal: PropTypes.number,
    onComplete: PropTypes.func,
    text: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    baseSize: 200,
    spinAngleStart: Math.random() * 10 + 10,
    spinTimeTotal: Math.random() * 3 + 4 * 1000,
  };

  drawRouletteWheel() {
    const { baseSize } = this.props;
    let { startAngle, arc, options } = this.state;

    // const spinTimeout = null;
    // const spinTime = 0;
    // const spinTimeTotal = 0;

    let ctx;

    const canvas = this.refs.canvas;
    if (canvas.getContext) {
      const outsideRadius = baseSize - 25;
      const textRadius = baseSize - 45;
      const insideRadius = baseSize - 55;

      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 600, 600);

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;

      ctx.font = '16px Helvetica';

      for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;

        ctx.fillStyle = getColor(i, options.length);

        ctx.beginPath();
        ctx.arc(baseSize, baseSize, outsideRadius, angle, angle + arc, false);
        ctx.arc(baseSize, baseSize, insideRadius, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.translate(baseSize + Math.cos(angle + arc / 2) * textRadius, baseSize + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }

      //Arrow
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.fillStyle = '#3f51b5';
      ctx.lineTo(baseSize + 10, baseSize - (outsideRadius + 20));
      ctx.lineTo(baseSize + 0, baseSize - (outsideRadius - 5));
      ctx.lineTo(baseSize - 10, baseSize - (outsideRadius + 20));
      ctx.fill();
      ctx.stroke();
    }
  }

  spin() {
    this.spinTimer = null;
    this.setState({ spinTime: 0 }, () => this.rotate());
  }

  rotate() {
    const { spinAngleStart, spinTimeTotal } = this.props;
    if (this.state.spinTime > 2800) {
      clearTimeout(this.spinTimer);
      this.stopRotateWheel();
    } else {
      const spinAngle = spinAngleStart - easeOut(this.state.spinTime, 0, spinAngleStart, spinTimeTotal);
      this.setState(
        {
          startAngle: this.state.startAngle + (spinAngle * Math.PI) / 180,
          spinTime: this.state.spinTime + 30,
        },
        () => {
          this.drawRouletteWheel();
          clearTimeout(this.spinTimer);
          this.spinTimer = setTimeout(() => this.rotate(), 30);
        }
      );
    }
  }

  stopRotateWheel() {
    let { startAngle, arc, options } = this.state;
    const { baseSize } = this.props;

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    ctx.save();
    ctx.font = 'bold 40px Helvetica';
    ctx.fillStyle = '#3f51b5';
    const text = options[index];
    ctx.fillText(text, baseSize - ctx.measureText(text).width / 2, baseSize);
    ctx.restore();
  }

  handleOnClick() {
    // 3f51b5
    const includeArray = this.state.text
      .replace('/s', '')
      .split(',')
      .filter((value) => value != '')
      .map((value) => value.replace(' ', ''));

    console.log(includeArray);

    if (includeArray.length == 0) {
      alert('대상자는 비어있을 수 없습니다.');
      return;
    }

    const newOptions = includeArray;
    this.setState({
      options: newOptions,
      arc: Math.PI / (newOptions.length / 2),
    });
    this.spin();
  }

  render() {
    const { baseSize } = this.props;

    return (
      <div className="roulette">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6"> Simple Roulette</Typography>
          </Toolbar>
        </AppBar>
        <Container fixed>
          <p>
            룰렛을 구동할 '단어'를 '쉼표' 구분자로 입력해주세요.
            <br />
            <br />
            예) A, B, C, D 중 하나를 고르고 싶다면,
            <br />
            아래 '대상 입력'에 'A, B, C, D' 처럼 입력
            <br />
            <br />
            From <a href="https://github.com/Tumne/react-roulette-wheel/tree/master/">react-roulette-wheel</a> | Made by <a href="https://github.com/WindSekirun">WindSekirun</a>
          </p>
          <form noValidate autoComplete="off">
            <TextField
              type="text"
              required
              label="대상 입력"
              placeholder="A, B, C"
              onChange={(e) => this.setState({ text: e.target.value })}
            />
          </form>
          <div className="roulette-container">
            <Button color="primary" variant="contained" onClick={this.handleOnClick} className="button" id="spin">
              Spin Roulette!
            </Button>
          </div>
          <div className="roulette-container">
            <canvas ref="canvas" width={baseSize * 2} height={baseSize * 2} className="roulette-canvas"></canvas>
          </div>
        </Container>
      </div>
    );
  }
}

export default Roulette;
