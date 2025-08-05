import WidgetKit
import SwiftUI

struct UserData: Codable {
    let id: Int
    let name: String
    let avatar: String
    let lastUpdated: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), userData: UserData(id: 1, name: "Loading...", avatar: "", lastUpdated: ""))
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), userData: loadUserData())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let currentDate = Date()
        let userData = loadUserData()
        let entry = SimpleEntry(date: currentDate, userData: userData)
        
        // Refresh every 15 minutes
        let refreshDate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        completion(timeline)
    }
    
    private func loadUserData() -> UserData {
        let appGroupId = "group.com.userlistapp.widget"
        let widgetDataKey = "widget_user_data"
        
        if let sharedDefaults = UserDefaults(suiteName: appGroupId),
           let dataString = sharedDefaults.string(forKey: widgetDataKey),
           let data = dataString.data(using: .utf8),
           let userData = try? JSONDecoder().decode(UserData.self, from: data) {
            return userData
        }
        
        return UserData(id: 0, name: "No Data", avatar: "", lastUpdated: "")
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let userData: UserData
}

struct UserListAppWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                AsyncImage(url: URL(string: entry.userData.avatar)) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                }
                .frame(width: 50, height: 50)
                .clipShape(Circle())
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.userData.name)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.primary)
                        .lineLimit(1)
                    
                    Text("Random User")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
                
                Spacer()
            }
            
            Spacer()
            
            HStack {
                Spacer()
                Text("Updated: \(formatDate(entry.userData.lastUpdated))")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
    }
    
    private func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: dateString) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .short
            displayFormatter.timeStyle = .short
            return displayFormatter.string(from: date)
        }
        return "Unknown"
    }
}

struct UserListAppWidget: Widget {
    let kind: String = "UserListAppWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            UserListAppWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Random User")
        .description("Shows a random user from your saved list")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}