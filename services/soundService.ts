import { Howl } from 'howler';

const sound = new Howl({
  src: ['https://actions.google.com/sounds/v1/ui/click.ogg'],
  volume: 0.5,
});

export const playClickSound = () => {
  sound.play();
};
