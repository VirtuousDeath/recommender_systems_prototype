from math import sqrt

def euclidian(users, user1, user2):
  si = {}
  if not user1 in users: return -1
  if not user2 in users: return -2
  for item in users[user1]:
      if item in users[user2]: si[item]=1
  if len(si) == 0: return -3

  summation = sum([pow(users[user1][item] - users[user2][item],2)
                    for item in users[user1] if item in users[user2]])
  return sqrt(summation)

def similarities(users, user1, user2):
  de = euclidian(users, user1, user2)
  sim = 1/(1+de)
  return sim

def getSimilars(users, user):
  listSimilarities = [(round(similarities(users, user, outro),2), outro)
      for outro in users if outro != user]
  listSimilarities.sort()
  listSimilarities.reverse()
  return listSimilarities