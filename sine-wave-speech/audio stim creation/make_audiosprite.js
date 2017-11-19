var audiosprite = require('audiosprite')

var files = [
"silence.wav",
"he_dropped_the_cheeseburger.wav",
"he_finished_all_the_chocolates.wav",
"he_is_peeling_a_banana.wav",
"he_made_a_salad.wav",
"she_bought_a_cake.wav",
"she_grew_lots_of_tomatoes.wav",
"she_has_cereal_for_breakfast.wav",
"she_likes_eating_carrots.wav",
"the_bee_is_on_the_flower.wav",
"the_birds_are_flying.wav",
"the_butterfly_is_pretty.wav",
"the_cheese_is_tasty.wav",
"the_chickens_lay_eggs.wav",
"the_dog_is_barking.wav",
"the_dolphins_are_swimming.wav",
"the_elephant_is_very_big.wav",
"the_fish_are_in_the_river.wav",
"the_horses_are_in_the_field.wav",
"the_ladybirds_are_very_red.wav",
"the_monkey_is_up_in_the_tree.wav",
"the_pizza_was_too_hot.wav",
"the_turtle_lives_in_the_sea.wav",
"we_had_pasta_for_dinner.wav",
"we_took_some_sandwiches.wav",
"he_dropped_the_cheeseburger_SWS.wav",
"he_finished_all_the_chocolates_SWS.wav",
"he_is_peeling_a_banana_SWS.wav",
"he_made_a_salad_SWS.wav",
"she_bought_a_cake_SWS.wav",
"she_grew_lots_of_tomatoes_SWS.wav",
"she_has_cereal_for_breakfast_SWS.wav",
"she_likes_eating_carrots_SWS.wav",
"the_bee_is_on_the_flower_SWS.wav",
"the_birds_are_flying_SWS.wav",
"the_butterfly_is_pretty_SWS.wav",
"the_cheese_is_tasty_SWS.wav",
"the_chickens_lay_eggs_SWS.wav",
"the_dog_is_barking_SWS.wav",
"the_dolphins_are_swimming_SWS.wav",
"the_elephant_is_very_big_SWS.wav",
"the_fish_are_in_the_river_SWS.wav",
"the_horses_are_in_the_field_SWS.wav",
"the_ladybirds_are_very_red_SWS.wav",
"the_monkey_is_up_in_the_tree_SWS.wav",
"the_pizza_was_too_hot_SWS.wav",
"the_turtle_lives_in_the_sea_SWS.wav",
"we_had_pasta_for_dinner_SWS.wav",
"we_took_some_sandwiches_SWS.wav",
]

var opts = {
	output: 'output',
	export: 'mp3',
	}

audiosprite(files, opts, function(err, obj) {
  if (err) return console.error(err)

  console.log(JSON.stringify(obj, null, 2))
})