const questions = [
  {
    id: 1,
    hand: ["🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏","🀐","🀑","🀒","🀓"],
    river: ["🀙","🀚","🀛"],
    answer: "🀐",
    analysis: "Discard the 8m to keep a chance for a straight."
  },
  {
    id: 2,
    hand: ["🀇","🀇","🀈","🀉","🀋","🀌","🀍","🀎","🀏","🀐","🀑","🀒","🀓"],
    river: ["🀙","🀚","🀛"],
    answer: "🀇",
    analysis: "Pair tiles are valuable; discard one of the single terminals."
  },
  {
    id: 3,
    hand: ["🀇","🀈","🀉","🀊","🀊","🀌","🀍","🀎","🀏","🀐","🀑","🀒","🀓"],
    river: [],
    answer: "🀊",
    analysis: "Break the duplicate 4m to pursue a mixed straight."
  }
]

export default questions
