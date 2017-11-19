import pandas as pd

trials = pd.read_csv('trials.csv')

times = pd.read_json('times.json')

times = times.T

times['length'] = times['end'] - times['start']

for i, r in trials.iterrows():
	trials.ix[i, 'clear_sound_start'] = times.loc[r.target_sentence].start
	trials.ix[i, 'clear_sound_length'] = times.loc[r.target_sentence].length

	trials.ix[i, 'target_sound_start'] = times.loc[r.target_sentence + "_SWS"].start
	trials.ix[i, 'target_sound_length'] = times.loc[r.target_sentence + "_SWS"].length

	trials.ix[i, 'foil_sound_start'] = times.loc[r.foil_sentence + "_SWS"].start
	trials.ix[i, 'foil_sound_length'] = times.loc[r.foil_sentence + "_SWS"].length

trials.to_csv('trials2.csv', index=False)