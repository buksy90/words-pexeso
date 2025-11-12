import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PexesoCard from '~/components/PexesoCard.vue';

describe('PexesoCard.vue', () => {
  it('renders word on back and toggles flipped class when isRevealed changes', async () => {
    const card = { word: 'cat', isRevealed: false, isMatched: false };
    const wrapper = mount(PexesoCard as any, {
      props: {
        card,
        index: 0,
        settings: { fontFamily: 'Arial', fontSize: 16 }
      }
    });

    // Initially should not have flipped class
    expect(wrapper.classes()).not.toContain('is-flipped');

    // Update prop to reveal card
    await wrapper.setProps({ card: { ...card, isRevealed: true } });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('is-flipped');

    // Update prop to matched should still have flipped
    await wrapper.setProps({ card: { ...card, isRevealed: true, isMatched: true } });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('is-flipped');
    expect(wrapper.classes()).toContain('is-matched');
  });

  it('emits flip event with index when clicked', async () => {
    const card = { word: 'dog', isRevealed: false, isMatched: false };
    const wrapper = mount(PexesoCard as any, {
      props: {
        card,
        index: 3,
        settings: { fontFamily: 'Arial', fontSize: 14 }
      }
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('flip');
    const flipEvents = wrapper.emitted('flip') as any[];
    expect(flipEvents[0]).toEqual([3]);
  });
});
