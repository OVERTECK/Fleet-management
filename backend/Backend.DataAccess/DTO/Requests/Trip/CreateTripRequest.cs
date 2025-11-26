namespace Backend.DataAccess.DTO.Requests;

public class CreateTripRequest
{
    public required string CarId { get; set; }

    public required Guid DriverId { get; set; }

    public required DateTime TimeStart { get; set; }

    public required DateTime TimeEnd { get; set; }

    public required int TraveledKM  { get; set; }

    public required int ConsumptionLitersFuel { get; set; }

    public required Guid CreatedUserId { get; set; }
}