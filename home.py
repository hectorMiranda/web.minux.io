from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
import openai
import os  

app = Flask(__name__)
api = Api(app, version='1.0', title='minux bot',
          description='first commit')

ns = api.namespace('chat', description='bot operations')

chat_model = api.model('Chat', {
    'message': fields.String(required=True, description='hey minux')
})

openai.api_key = os.getenv('OPENAI_API_KEY')

@ns.route('/')
class Chat(Resource):
    @ns.doc('chat_with_openai')
    @ns.expect(chat_model)
    @ns.marshal_with(chat_model, code=200)
    def post(self):
        data = request.json
        user_message = data['message']

        response = openai.Completion.create(
            engine="text-davinci-003",  # or another model like "gpt-3.5-turbo"
            prompt=user_message,
            max_tokens=150
        )
        
        bot_response = response.choices[0].text.strip()
        return jsonify({'message': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
