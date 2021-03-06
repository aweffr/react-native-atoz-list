import React, {Component} from 'react';
import {View, Text, PanResponder, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

class LetterPicker extends Component {

  render() {
    return (
      <TouchableOpacity onPress={() => this.props._onTouchLetter()}>
        <Text style={{fontSize: 14, color: '#141A22', paddingHorizontal: 5}}>
          {this.props.letter}
        </Text>
      </TouchableOpacity>
    );
  }
}


const defaultAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export default class AlphabetPicker extends Component {
  constructor(props, context) {
    super(props, context);
    let alphabet = (props.alphabet) ? props.alphabet : defaultAlphabet;
    this.state = {
      alphabet: alphabet,
    };
  }

  componentWillMount() {
    // this._panResponder = PanResponder.create({
    //     onStartShouldSetPanResponder: () => true,
    //     onMoveShouldSetPanResponder: () => true,
    //     onPanResponderGrant: (e, gestureState) => {
    //         this.props.onTouchStart && this.props.onTouchStart();

    //         this.tapTimeout = setTimeout(() => {
    //             this._onTouchLetter(this._findTouchedLetter(gestureState.y0));
    //         }, 100);
    //     },
    //     onPanResponderMove: (evt, gestureState) => {
    //         clearTimeout(this.tapTimeout);
    //         this._onTouchLetter(this._findTouchedLetter(gestureState.moveY));
    //     },
    //     onPanResponderTerminate: this._onPanResponderEnd.bind(this),
    //     onPanResponderRelease: this._onPanResponderEnd.bind(this),
    // });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.alphabet !== nextProps.alphabet) {
      this.setState({alphabet: nextProps.alphabet})
    }
  }

  _onTouchLetter(letter) {
    letter && this.props.onTouchLetter && this.props.onTouchLetter(letter);
  }

  _onPanResponderEnd() {
    requestAnimationFrame(() => {
      this.props.onTouchEnd && this.props.onTouchEnd();
    });
  }

  _findTouchedLetter(y) {
    let top = y - (this.absContainerTop || 0);
    const {alphabet} = this.state;

    if (top >= 1 && top <= this.containerHeight) {
      return alphabet[Math.round((top / this.containerHeight) * alphabet.length)]
    }
  }

  _onLayout(event) {
    this.refs.alphabetContainer.measure((x1, y1, width, height, px, py) => {
      this.absContainerTop = py;
      this.containerHeight = height;
    });
  }

  render() {
    const {alphabet} = this.state;
    this._letters = (
      alphabet.map((letter) => <LetterPicker _onTouchLetter={() => this._onTouchLetter(letter)} letter={letter}
                                             key={letter}/>)
    );

    return (
      <View
        ref='alphabetContainer'
        // {...this._panResponder.panHandlers}
        onLayout={this._onLayout.bind(this)}
        style={{paddingHorizontal: 5, backgroundColor: 'transparent', zIndex: 999}}>
        <View style={{alignItems: 'center'}}>
          {this._letters}
        </View>
      </View>
    );
  }
}
