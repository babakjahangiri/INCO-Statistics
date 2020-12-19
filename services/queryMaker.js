/*
This query plan return the query that shows applicant who Approved in step1 or step2 
and submitted(updatedAt) after given date (fromDate) from given Cites.
if the given cites is empty it return applicants in all cities
*/
// eslint-disable-next-line max-len
const cityConditionMaker = ((cities) => {
  if ((cities.length) > 0) {
    return cities.map((city) => ({ city }));
  }
  return [{}];
});

const queryPlan1 = (cities, fromDate = '2019-9-1') => {
  const stepId1 = '5cb8a846fbf8e118bb0e9e55';
  const stepId2 = '5cb8a88efbf8e118bb0e9e56';
  const stepStatus = 'Approved';

  const result = [
    {
      $lookup: {
        from: 'applicant_progresses',
        localField: 'userId',
        foreignField: 'userId',
        as: 'steps',
      },
    },
    { $unwind: '$steps' },
    {
      $match: {
        $and: [
          {
            $or: cityConditionMaker(cities),
          },
          {
            $and: [
              {
                $or: [
                  { 'steps.stepId': stepId1 },
                  { 'steps.stepId': stepId2 },
                ],
              },
              { 'steps.status': stepStatus },
            ],
          },
          {
            'steps.updatedAt': { $gt: new Date(fromDate) },
          },
        ],
      },
    },
    { $count: 'count' },
  ];

  return result;
};

module.exports = { queryPlan1, cityConditionMaker };
